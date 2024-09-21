import { DirectionComethEnum } from '../../models/directionCometh.enum.js';
import { Result } from '@thames/monads';

export interface ComethsInterfaceUsecase {
  addCometh(
    row: number,
    column: number,
    direction: DirectionComethEnum,
  ): Promise<Result<string, string>>;

  deleteCometh(row: number, column: number): Promise<Result<string, string>>;

  detectComethAndExtractDirection(
    cell: string,
  ): DirectionComethEnum | undefined;
}
