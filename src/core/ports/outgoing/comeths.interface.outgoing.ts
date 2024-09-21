import { Result } from '@thames/monads';
import { DirectionComethEnum } from '../../models/directionCometh.enum.js';

export interface ComethsInterfaceOutgoing {
  addCometh(
    row: number,
    column: number,
    direction: DirectionComethEnum,
  ): Promise<Result<string, string>>;

  deleteCometh(row: number, column: number): Promise<Result<string, string>>;
}
