import 'reflect-metadata';
import { SoloonsUsecase } from '../../../../src/core/usecases/soloons/soloons.usecase.js';
import { Err, Ok } from '@thames/monads';
import { SoloonsInterfaceOutgoing } from '../../../../src/core/ports/outgoing/soloons.interface.outgoing.js';
import { Container } from 'inversify';
import { TYPES } from '../../../../src/_di/types.js';
import { ColorSoloonEnum } from '../../../../src/core/models/colorSoloon.enum.js';
import { isElementAdjacent } from '../../../../src/core/utils/utils.js';

jest.mock('../../../../src/core/utils/utils.js'); // Mock the utils module

const mockSoloonsInterfaceOutgoing = {
  addSoloon: jest.fn(),
  deleteSoloon: jest.fn(),
};

describe('SoloonsUsecase', () => {
  let soloonsUsecase: SoloonsUsecase;

  beforeEach(() => {
    const container = new Container();

    container
      .bind<SoloonsInterfaceOutgoing>(TYPES.soloonsInterfaceOutgoing)
      .toConstantValue(mockSoloonsInterfaceOutgoing);

    container.bind<SoloonsUsecase>(SoloonsUsecase).toSelf();

    soloonsUsecase = container.get<SoloonsUsecase>(SoloonsUsecase);
  });

  describe('addSoloon', () => {
    it('should call addSoloon on SoloonsInterfaceOutgoing and return success if POLYANET is adjacent', async () => {
      const row = 1;
      const column = 2;
      const color = ColorSoloonEnum.RED;
      const offsetRow = 0;
      const offsetColumn = 1;
      const subMegaverse = [
        ['SPACE', 'POLYANET'],
        ['SPACE', 'SPACE'],
      ];

      (isElementAdjacent as jest.Mock).mockReturnValue(true);
      mockSoloonsInterfaceOutgoing.addSoloon.mockResolvedValue(
        Ok('Soloon added'),
      );

      const result = await soloonsUsecase.addSoloon(
        row,
        column,
        color,
        offsetRow,
        offsetColumn,
        subMegaverse,
      );

      expect(mockSoloonsInterfaceOutgoing.addSoloon).toHaveBeenCalledWith(
        row,
        column,
        color,
      );
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Soloon added');
    });

    it('should return error if POLYANET is not adjacent', async () => {
      const row = 1;
      const column = 2;
      const color = ColorSoloonEnum.PURPLE;
      const offsetRow = 0;
      const offsetColumn = 1;
      const subMegaverse = [
        ['SPACE', 'SPACE'],
        ['SPACE', 'SPACE'],
      ];

      (isElementAdjacent as jest.Mock).mockReturnValue(false);
      const result = await soloonsUsecase.addSoloon(
        row,
        column,
        color,
        offsetRow,
        offsetColumn,
        subMegaverse,
      );

      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toContain('There is no POLYANET adjacent');
    });
  });

  describe('deleteSoloon', () => {
    it('should call deleteSoloon on SoloonsInterfaceOutgoing and return success', async () => {
      const row = 1;
      const column = 2;
      mockSoloonsInterfaceOutgoing.deleteSoloon.mockResolvedValue(
        Ok('Soloon deleted'),
      );

      const result = await soloonsUsecase.deleteSoloon(row, column);

      expect(mockSoloonsInterfaceOutgoing.deleteSoloon).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Soloon deleted');
    });

    it('should return error if deleteSoloon fails', async () => {
      const row = 1;
      const column = 2;
      mockSoloonsInterfaceOutgoing.deleteSoloon.mockResolvedValue(
        Err('Failed to delete Soloon'),
      );

      const result = await soloonsUsecase.deleteSoloon(row, column);

      expect(mockSoloonsInterfaceOutgoing.deleteSoloon).toHaveBeenCalledWith(
        row,
        column,
      );
      expect(result.isErr()).toBe(true);
      expect(result.err().unwrap()).toBe('Failed to delete Soloon');
    });
  });

  describe('detectSoloonAndExtractColor', () => {
    it('should return the correct color for a valid soloon string', () => {
      const cell = 'This is a Red soloon';
      const result = soloonsUsecase.detectSoloonAndExtractColor(cell);

      expect(result).toBe(ColorSoloonEnum.RED);
    });

    it('should return undefined for a string that does not contain a valid soloon', () => {
      const cell = 'This is not a valid sooloon';
      const result = soloonsUsecase.detectSoloonAndExtractColor(cell);

      expect(result).toBeUndefined();
    });

    it('should return a random color if "soloon" is mentioned without a color', () => {
      const cell = 'This is a soloon';
      const randomColor = ColorSoloonEnum.BLUE; // Assume the random function returns Blue
      jest
        .spyOn(soloonsUsecase as any, 'getRandomSoloonColor')
        .mockReturnValue(randomColor);

      const result = soloonsUsecase.detectSoloonAndExtractColor(cell);

      expect(result).toBe(randomColor);
    });
  });
});
