import { inject, injectable } from 'inversify';
import { TYPES } from '../../../_di/types.js';
import { ComethsInterfaceOutgoing } from '../../ports/outgoing/comeths.interface.outgoing.js';
import { DirectionComethEnum } from '../../models/directionCometh.enum.js';
import { Result } from '@thames/monads';
import { ComethsInterfaceUsecase } from './comeths.interface.usecase.js';

@injectable()
export class ComethsUsecase implements ComethsInterfaceUsecase {
  @inject(TYPES.comethsInterfaceOutgoing)
  private readonly comethsInterfaceOutgoing: ComethsInterfaceOutgoing;

  public async addCometh(
    row: number,
    column: number,
    direction: DirectionComethEnum,
  ): Promise<Result<string, string>> {
    return this.comethsInterfaceOutgoing.addCometh(row, column, direction);
  }

  public async deleteCometh(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    return this.comethsInterfaceOutgoing.deleteCometh(row, column);
  }

  public detectComethAndExtractDirection(
    cell: string,
  ): DirectionComethEnum | undefined {
    const normalizedCell = cell.toLowerCase();

    for (const direction of Object.values(DirectionComethEnum)) {
      const regex = new RegExp(
        `(?:${direction})[\\s_]*cometh|cometh[\\s_]*${direction}`,
        'i',
      );

      if (regex.test(normalizedCell)) {
        return direction;
      }
    }

    return undefined;
  }
}
