import 'reflect-metadata';
import { ComethsUsecase } from '../../../../src/core/usecases/comeths/comeths.usecase.js';
import { DirectionComethEnum } from '../../../../src/core/models/directionCometh.enum.js';
import { Err, Ok } from '@thames/monads';
import { ComethsInterfaceOutgoing } from '../../../../src/core/ports/outgoing/comeths.interface.outgoing.js';
import { Container } from 'inversify';
import { TYPES } from '../../../../src/_di/types.js';

const mockComethsInterfaceOutgoing = {
  addCometh: jest.fn(),
  deleteCometh: jest.fn(),
};

describe('ComethsUsecase', () => {
  let comethsUsecase: ComethsUsecase;

  beforeEach(() => {
    const container = new Container();

    container
      .bind<ComethsInterfaceOutgoing>(TYPES.comethsInterfaceOutgoing)
      .toConstantValue(mockComethsInterfaceOutgoing);

    container.bind<ComethsUsecase>(ComethsUsecase).toSelf();

    comethsUsecase = container.get<ComethsUsecase>(ComethsUsecase);
  });

  describe('addCometh', () => {
    it('should call addCometh on ComethsInterfaceOutgoing and return success', async () => {
      const row = 1;
      const column = 2;
      const direction = DirectionComethEnum.UP;

      mockComethsInterfaceOutgoing.addCometh.mockResolvedValue(
        Ok('Cometh added'),
      );

      const result = await comethsUsecase.addCometh(row, column, direction);

      expect(mockComethsInterfaceOutgoing.addCometh).toHaveBeenCalledWith(
        row,
        column,
        direction,
      );
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Cometh added');
    });

    it('should return error if addCometh fails', async () => {
      const row = 1;
      const column = 2;
      const direction = DirectionComethEnum.DOWN;

      mockComethsInterfaceOutgoing.addCometh.mockResolvedValue(
        Err('Failed to add Cometh'),
      );

      const result = await comethsUsecase.addCometh(row, column, direction);

      expect(mockComethsInterfaceOutgoing.addCometh).toHaveBeenCalledWith(
        row,
        column,
        direction,
      );
      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toBe('Failed to add Cometh');
    });
  });

  describe('deleteCometh', () => {
    it('should call deleteCometh on ComethsInterfaceOutgoing and return success', async () => {
      const row = 1;
      const column = 2;

      mockComethsInterfaceOutgoing.deleteCometh.mockResolvedValue(
        Ok('Cometh deleted'),
      );

      const result = await comethsUsecase.deleteCometh(row, column);

      expect(mockComethsInterfaceOutgoing.deleteCometh).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Cometh deleted');
    });

    it('should return error if deleteCometh fails', async () => {
      const row = 1;
      const column = 2;

      mockComethsInterfaceOutgoing.deleteCometh.mockResolvedValue(
        Err('Failed to delete Cometh'),
      );

      const result = await comethsUsecase.deleteCometh(row, column);

      expect(mockComethsInterfaceOutgoing.deleteCometh).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toBe('Failed to delete Cometh');
    });
  });

  describe('detectComethAndExtractDirection', () => {
    it('should return the correct direction for a valid cell string', () => {
      const cell = 'This is a UP Cometh';
      const result = comethsUsecase.detectComethAndExtractDirection(cell);

      expect(result).toBe(DirectionComethEnum.UP);
    });

    it('should return undefined for a string that does not contain a valid direction', () => {
      const cell = 'This is not a valid cometh';
      const result = comethsUsecase.detectComethAndExtractDirection(cell);

      expect(result).toBeUndefined();
    });
  });
});
