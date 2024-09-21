import { Result } from '@thames/monads';

export interface PolyanetsInterfaceUsecase {
  addPolyanet(row: number, column: number): Promise<Result<string, string>>;

  deletePolyanet(row: number, column: number): Promise<Result<string, string>>;

  detectPolyanet(cell: string): Boolean;
}
