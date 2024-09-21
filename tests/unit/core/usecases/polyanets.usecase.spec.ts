import 'reflect-metadata';
import { PolyantesUsecase } from '../../../../src/core/usecases/polyanets/polyanets.usecase.js';
import { Err, Ok } from '@thames/monads';
import { PolyanetsInterfaceOutgoing } from '../../../../src/core/ports/outgoing/polyanets.interface.outgoing.js';
import { Container } from 'inversify';
import { TYPES } from '../../../../src/_di/types.js';

const mockPolyanetsInterfaceOutgoing = {
  addPolyanet: jest.fn(),
  deletePolyanet: jest.fn(),
};

describe('PolyantesUsecase', () => {
  let polyantesUsecase: PolyantesUsecase;

  beforeEach(() => {
    const container = new Container();

    container
      .bind<PolyanetsInterfaceOutgoing>(TYPES.polyanetsInterfaceOutgoing)
      .toConstantValue(mockPolyanetsInterfaceOutgoing);

    container.bind<PolyantesUsecase>(PolyantesUsecase).toSelf();

    polyantesUsecase = container.get<PolyantesUsecase>(PolyantesUsecase);
  });

  describe('addPolyanet', () => {
    it('should call addPolyanet on PolyanetsInterfaceOutgoing and return success', async () => {
      const row = 1;
      const column = 2;
      mockPolyanetsInterfaceOutgoing.addPolyanet.mockResolvedValue(
        Ok('Polyanet added'),
      );

      const result = await polyantesUsecase.addPolyanet(row, column);

      expect(mockPolyanetsInterfaceOutgoing.addPolyanet).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Polyanet added');
    });

    it('should return error if addPolyanet fails', async () => {
      const row = 1;
      const column = 2;
      mockPolyanetsInterfaceOutgoing.addPolyanet.mockResolvedValue(
        Err('Failed to add Polyanet'),
      );

      const result = await polyantesUsecase.addPolyanet(row, column);

      expect(mockPolyanetsInterfaceOutgoing.addPolyanet).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toBe('Failed to add Polyanet');
    });
  });

  describe('deletePolyanet', () => {
    it('should call deletePolyanet on PolyanetsInterfaceOutgoing and return success', async () => {
      const row = 1;
      const column = 2;
      mockPolyanetsInterfaceOutgoing.deletePolyanet.mockResolvedValue(
        Ok('Polyanet deleted'),
      );

      const result = await polyantesUsecase.deletePolyanet(row, column);

      expect(
        mockPolyanetsInterfaceOutgoing.deletePolyanet,
      ).toHaveBeenCalledWith(row, column);
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Polyanet deleted');
    });

    it('should return error if deletePolyanet fails', async () => {
      const row = 1;
      const column = 2;
      mockPolyanetsInterfaceOutgoing.deletePolyanet.mockResolvedValue(
        Err('Failed to delete Polyanet'),
      );

      const result = await polyantesUsecase.deletePolyanet(row, column);

      expect(
        mockPolyanetsInterfaceOutgoing.deletePolyanet,
      ).toHaveBeenCalledWith(row, column);
      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toBe('Failed to delete Polyanet');
    });
  });

  describe('detectPolyanet', () => {
    it('should return true for a cell containing "Polyanet"', () => {
      const cell = 'This is a Polyanet';
      const result = polyantesUsecase.detectPolyanet(cell);

      expect(result).toBe(true);
    });

    it('should return false for a cell not containing "Polyanet"', () => {
      const cell = 'This is not relevant';
      const result = polyantesUsecase.detectPolyanet(cell);

      expect(result).toBe(false);
    });
  });
});
