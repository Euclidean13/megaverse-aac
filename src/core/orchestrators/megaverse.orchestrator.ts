import { Err, Ok, Result } from '@thames/monads';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../_di/types.js';
import { PolyanetsInterfaceUsecase } from '../usecases/polyanets/polyanets.interface.usecase.js';
import { SoloonsInterfaceUsecase } from '../usecases/soloons/soloons.interface.usecase.js';
import { ComethsInterfaceUsecase } from '../usecases/comeths/comeths.interface.usecase.js';
import { extractSubmatrix } from '../utils/utils.js';
import { MegaverseInterfaceIncoming } from '../ports/incoming/megaverse.interface.incoming.js';

@injectable()
export class MegaverseOrchestrator implements MegaverseInterfaceIncoming {
  @inject(TYPES.polyanetsInterfaceUsecase)
  private readonly polyanetsInterfaceUsecase: PolyanetsInterfaceUsecase;
  @inject(TYPES.soloonsInterfaceUsecase)
  private readonly soloonsInterfaceUsecase: SoloonsInterfaceUsecase;
  @inject(TYPES.comethsInterfaceUsecase)
  private readonly comethsInterfaceUsecase: ComethsInterfaceUsecase;

  public async buildMegaverse(
    pattern: string[][],
  ): Promise<Result<string, string[]>> {
    const errors: string[] = [];

    for (let row = 0; row < pattern.length; row++) {
      for (let column = 0; column < pattern[row].length; column++) {
        const errorMessage = await this.processCell(
          row,
          column,
          pattern[row][column],
          pattern,
        );
        if (errorMessage.isErr()) {
          errors.push(errorMessage.err().unwrap());
        }
      }
    }

    if (errors.length > 0) {
      return Err(errors); // Return all accumulated errors
    }

    return Ok('Pattern successfully created!');
  }

  private async processCell(
    row: number,
    column: number,
    cell: string,
    pattern: string[][],
  ): Promise<Result<string, string>> {
    // Check and add Polyanet
    if (this.polyanetsInterfaceUsecase.detectPolyanet(cell)) {
      return await this.polyanetsInterfaceUsecase.addPolyanet(row, column);
    }

    // Check and add Soloon with extracted color and submatrix
    const soloonColor =
      this.soloonsInterfaceUsecase.detectSoloonAndExtractColor(cell);
    if (soloonColor) {
      const subMatrixMetadata = extractSubmatrix(pattern, row, column);
      return await this.soloonsInterfaceUsecase.addSoloon(
        row,
        column,
        soloonColor,
        subMatrixMetadata.offsets.rowOffset,
        subMatrixMetadata.offsets.colOffset,
        subMatrixMetadata.submatrix,
      );
    }

    // Check and add Cometh with extracted direction
    const comethDirection =
      this.comethsInterfaceUsecase.detectComethAndExtractDirection(cell);
    if (comethDirection) {
      return await this.comethsInterfaceUsecase.addCometh(
        row,
        column,
        comethDirection,
      );
    }

    // Clean and leave it as SPACE
    await this.polyanetsInterfaceUsecase.deletePolyanet(row, column);
    await this.soloonsInterfaceUsecase.deleteSoloon(row, column);
    await this.comethsInterfaceUsecase.deleteCometh(row, column);

    return Ok('Leave as SPACE');
  }
}
