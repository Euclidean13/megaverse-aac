import { Result } from '@thames/monads';

export interface PolyanetsInterfaceOutgoing {
  addPolyanet(row: number, column: number): Promise<Result<string, string>>;

  deletePolyanet(row: number, column: number): Promise<Result<string, string>>;
}
