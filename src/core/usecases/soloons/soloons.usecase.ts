import { inject, injectable } from 'inversify';
import { ColorSoloonEnum } from '../../models/colorSoloon.enum.js';
import { Err, Result } from '@thames/monads';
import { TYPES } from '../../../_di/types.js';
import { SoloonsInterfaceOutgoing } from '../../ports/outgoing/soloons.interface.outgoing.js';
import { isElementAdjacent } from '../../utils/utils.js';
import { logger } from '../../../utils/logsHelper.js';
import { SoloonsInterfaceUsecase } from './soloons.interface.usecase.js';

@injectable()
export class SoloonsUsecase implements SoloonsInterfaceUsecase {
  @inject(TYPES.soloonsInterfaceOutgoing)
  private readonly soloonsInterfaceOutgoing: SoloonsInterfaceOutgoing;

  public async addSoloon(
    row: number,
    column: number,
    color: ColorSoloonEnum,
    offsetRow: number,
    offsetColumn: number,
    subMegaverse: string[][], // Around the position of the Soloon
  ): Promise<Result<string, string>> {
    if (isElementAdjacent(subMegaverse, offsetRow, offsetColumn, 'POLYANET')) {
      return this.soloonsInterfaceOutgoing.addSoloon(row, column, color);
    } else {
      const message = `Unable to add Soloon [${row},${column}]. There is no POLYANET adjacent. It will be leave as SPACE`;
      logger.warn(message);
      return Err(message);
    }
  }

  public async deleteSoloon(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    return this.soloonsInterfaceOutgoing.deleteSoloon(row, column);
  }

  public detectSoloonAndExtractColor(
    cell: string,
  ): ColorSoloonEnum | undefined {
    const normalizedCell = cell.toLowerCase();

    for (const color of Object.values(ColorSoloonEnum)) {
      const regex = new RegExp(
        `(?:${color})[\\s_]*soloon|soloon[\\s_]*${color}`,
        'i',
      );

      if (regex.test(normalizedCell)) {
        return color;
      }
    }

    const soloonRegex = /soloon/i;
    if (soloonRegex.test(normalizedCell)) {
      logger.info(
        'No valid color associated with SOLOON found. Added random color.',
      );
      return this.getRandomSoloonColor();
    }

    return undefined;
  }

  private getRandomSoloonColor(): ColorSoloonEnum {
    const colors = Object.values(ColorSoloonEnum);
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  }
}
