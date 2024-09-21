import 'reflect-metadata';
import { Ok } from '@thames/monads';
import { MegaverseOrchestrator } from '../../../../src/core/orchestrators/megaverse.orchestrator.js';
import { PolyanetsInterfaceUsecase } from '../../../../src/core/usecases/polyanets/polyanets.interface.usecase.js';
import { SoloonsInterfaceUsecase } from '../../../../src/core/usecases/soloons/soloons.interface.usecase.js';
import { ComethsInterfaceUsecase } from '../../../../src/core/usecases/comeths/comeths.interface.usecase.js';
import { Container } from 'inversify';
import { TYPES } from '../../../../src/_di/types.js';
import { extractSubmatrix } from '../../../../src/core/utils/utils.js';

// Mock the use cases
const mockPolyanetsInterfaceUsecase = {
  addPolyanet: jest.fn(),
  detectPolyanet: jest.fn(),
  deletePolyanet: jest.fn(),
};

const mockSoloonsInterfaceUsecase = {
  addSoloon: jest.fn(),
  detectSoloonAndExtractColor: jest.fn(),
  deleteSoloon: jest.fn(),
};

const mockComethsInterfaceUsecase = {
  addCometh: jest.fn(),
  detectComethAndExtractDirection: jest.fn(),
  deleteCometh: jest.fn(),
};

// Mock the utility function
jest.mock('../../../../src/core/utils/utils.js', () => ({
  extractSubmatrix: jest.fn(),
}));

describe('MegaverseOrchestrator', () => {
  let orchestrator: MegaverseOrchestrator;

  beforeEach(() => {
    const container = new Container();
    container
      .bind<PolyanetsInterfaceUsecase>(TYPES.polyanetsInterfaceUsecase)
      .toConstantValue(mockPolyanetsInterfaceUsecase);
    container
      .bind<SoloonsInterfaceUsecase>(TYPES.soloonsInterfaceUsecase)
      .toConstantValue(mockSoloonsInterfaceUsecase);
    container
      .bind<ComethsInterfaceUsecase>(TYPES.comethsInterfaceUsecase)
      .toConstantValue(mockComethsInterfaceUsecase);
    container
      .bind<MegaverseOrchestrator>(TYPES.megaverseOrchestrator)
      .to(MegaverseOrchestrator);

    orchestrator = container.get<MegaverseOrchestrator>(
      TYPES.megaverseOrchestrator,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buildMegaverse', () => {
    it('should return success when all cells are processed successfully', async () => {
      const pattern = [
        ['POLYANET', 'SOLOON_RED', 'COMETH_NORTH'],
        ['SPACE', 'SPACE', 'SPACE'],
      ];

      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(true);
      mockPolyanetsInterfaceUsecase.addPolyanet.mockResolvedValue(
        Ok('Polyanet added'),
      );
      mockSoloonsInterfaceUsecase.detectSoloonAndExtractColor.mockReturnValue(
        'RED',
      );
      mockSoloonsInterfaceUsecase.addSoloon.mockResolvedValue(
        Ok('Soloon added'),
      );
      mockComethsInterfaceUsecase.detectComethAndExtractDirection.mockReturnValue(
        'NORTH',
      );
      mockComethsInterfaceUsecase.addCometh.mockResolvedValue(
        Ok('Cometh added'),
      );

      (extractSubmatrix as jest.Mock).mockReturnValue({
        submatrix: [],
        offsets: { rowOffset: 0, colOffset: 0 },
      });

      const result = await orchestrator.buildMegaverse(pattern);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Pattern successfully created!');
    });

    it('should return spaces when some there is no element matched', async () => {
      const pattern = [['POLYANEHHT', 'INVALID', 'COMETH_NORTH']];

      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(undefined);
      mockSoloonsInterfaceUsecase.detectSoloonAndExtractColor.mockReturnValue(
        undefined,
      );
      mockComethsInterfaceUsecase.detectComethAndExtractDirection.mockReturnValue(
        undefined,
      );

      const result = await orchestrator.buildMegaverse(pattern);

      expect(result.ok().unwrap()).toEqual('Pattern successfully created!');
    });
  });

  describe('processCell', () => {
    it('should add Polyanet if detected', async () => {
      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(true);
      mockPolyanetsInterfaceUsecase.addPolyanet.mockResolvedValue(
        Ok('Polyanet added'),
      );

      const result = await orchestrator['processCell'](0, 0, 'POLYANET', [[]]);

      expect(result.isOk()).toBe(true);
      expect(mockPolyanetsInterfaceUsecase.addPolyanet).toHaveBeenCalledWith(
        0,
        0,
      );
    });

    it('should add Soloon if detected', async () => {
      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(false);
      mockSoloonsInterfaceUsecase.detectSoloonAndExtractColor.mockReturnValue(
        'RED',
      );
      mockSoloonsInterfaceUsecase.addSoloon.mockResolvedValue(
        Ok('Soloon added'),
      );

      (extractSubmatrix as jest.Mock).mockReturnValue({
        submatrix: [],
        offsets: { rowOffset: 0, colOffset: 0 },
      });

      const result = await orchestrator['processCell'](0, 0, 'SOLOON_RED', [
        [],
      ]);

      expect(result.isOk()).toBe(true);
      expect(mockSoloonsInterfaceUsecase.addSoloon).toHaveBeenCalledWith(
        0,
        0,
        'RED',
        0,
        0,
        [],
      );
    });

    it('should add Cometh if detected', async () => {
      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(false);
      mockSoloonsInterfaceUsecase.detectSoloonAndExtractColor.mockReturnValue(
        null,
      );
      mockComethsInterfaceUsecase.detectComethAndExtractDirection.mockReturnValue(
        'NORTH',
      );
      mockComethsInterfaceUsecase.addCometh.mockResolvedValue(
        Ok('Cometh added'),
      );

      const result = await orchestrator['processCell'](0, 0, 'COMETH_NORTH', [
        [],
      ]);

      expect(result.isOk()).toBe(true);
      expect(mockComethsInterfaceUsecase.addCometh).toHaveBeenCalledWith(
        0,
        0,
        'NORTH',
      );
    });

    it('should return Ok with "Leave as SPACE" if no entity detected', async () => {
      mockPolyanetsInterfaceUsecase.detectPolyanet.mockReturnValue(false);
      mockSoloonsInterfaceUsecase.detectSoloonAndExtractColor.mockReturnValue(
        null,
      );
      mockComethsInterfaceUsecase.detectComethAndExtractDirection.mockReturnValue(
        null,
      );

      const result = await orchestrator['processCell'](0, 0, 'SPACE', [[]]);

      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBe('Leave as SPACE');
    });
  });
});
