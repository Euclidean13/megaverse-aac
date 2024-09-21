import { ColorSoloonEnum } from '../../models/colorSoloon.enum.js';
import { Result } from '@thames/monads';

export interface SoloonsInterfaceUsecase {
  addSoloon(
    row: number,
    column: number,
    color: ColorSoloonEnum,
    offsetRow: number,
    offsetColumn: number,
    subMegaverse: string[][], // Around the position of the Soloon
  ): Promise<Result<string, string>>;

  deleteSoloon(row: number, column: number): Promise<Result<string, string>>;

  detectSoloonAndExtractColor(cell: string): ColorSoloonEnum | undefined;
}
