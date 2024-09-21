import { Result } from '@thames/monads';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../_di/types.js';
import { PolyanetsInterfaceOutgoing } from '../../ports/outgoing/polyanets.interface.outgoing.js';
import { PolyanetsInterfaceUsecase } from './polyanets.interface.usecase.js';

@injectable()
export class PolyantesUsecase implements PolyanetsInterfaceUsecase {
  @inject(TYPES.polyanetsInterfaceOutgoing)
  private readonly polyanetsInterfaceOutgoing: PolyanetsInterfaceOutgoing;

  public async addPolyanet(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    return this.polyanetsInterfaceOutgoing.addPolyanet(row, column);
  }

  public async deletePolyanet(
    row: number,
    column: number,
  ): Promise<Result<string, string>> {
    return this.polyanetsInterfaceOutgoing.deletePolyanet(row, column);
  }

  public detectPolyanet(cell: string): Boolean {
    const polyanetRegex = /Polyanet/i;
    return polyanetRegex.test(cell.toLowerCase());
  }
}
