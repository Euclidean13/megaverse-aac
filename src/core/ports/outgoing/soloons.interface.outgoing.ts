import { Result } from '@thames/monads';
import { ColorSoloonEnum } from '../../models/colorSoloon.enum.js';

export interface SoloonsInterfaceOutgoing {
  addSoloon(
    row: number,
    column: number,
    color: ColorSoloonEnum,
  ): Promise<Result<string, string>>;

  deleteSoloon(row: number, column: number): Promise<Result<string, string>>;
}
