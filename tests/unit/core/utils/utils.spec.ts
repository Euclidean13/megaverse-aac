import {
  extractSubmatrix,
  isElementAdjacent,
} from '../../../../src/core/utils/utils.js';

describe('Utility Functions', () => {
  describe('extractSubmatrix', () => {
    it('should return the correct submatrix and offsets for a central element', () => {
      const matrix = [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ];
      const { submatrix, offsets } = extractSubmatrix(matrix, 0, 0);

      expect(submatrix).toEqual([
        ['A', 'B'],
        ['D', 'E'],
      ]);
      expect(offsets).toEqual({ rowOffset: 0, colOffset: 0 });
    });

    it('should handle edges of the matrix', () => {
      const matrix = [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
      ];
      const { submatrix, offsets } = extractSubmatrix(matrix, 0, 0);

      expect(submatrix).toEqual([
        ['A', 'B'],
        ['D', 'E'],
      ]);
      expect(offsets).toEqual({ rowOffset: 0, colOffset: 0 });
    });

    it('should return a 1x1 submatrix for a single element', () => {
      const matrix = [['A']];
      const { submatrix, offsets } = extractSubmatrix(matrix, 0, 0);

      expect(submatrix).toEqual([['A']]);
      expect(offsets).toEqual({ rowOffset: 0, colOffset: 0 });
    });

    it('should handle positions near the bottom-right corner', () => {
      const matrix = [
        ['A', 'B'],
        ['C', 'D'],
      ];
      const { submatrix, offsets } = extractSubmatrix(matrix, 1, 1);

      expect(submatrix).toEqual([
        ['A', 'B'],
        ['C', 'D'],
      ]);
      expect(offsets).toEqual({ rowOffset: 1, colOffset: 1 });
    });
  });

  describe('isElementAdjacent', () => {
    it('should return true if the target element is adjacent', () => {
      const submatrix = [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ];
      const result = isElementAdjacent(submatrix, 1, 1, 'B');
      expect(result).toBe(true);
    });

    it('should return false if the target element is not adjacent', () => {
      const submatrix = [
        ['A', 'B', 'C'],
        ['D', 'E', 'F'],
        ['G', 'H', 'I'],
      ];
      const result = isElementAdjacent(submatrix, 1, 1, 'X');
      expect(result).toBe(false);
    });

    it('should handle edges correctly', () => {
      const submatrix = [
        ['A', 'B'],
        ['C', 'D'],
      ];
      const result = isElementAdjacent(submatrix, 0, 0, 'B');
      expect(result).toBe(true);
    });

    it('should return false for out-of-bounds access', () => {
      const submatrix = [['A', 'B', 'C']];
      const result = isElementAdjacent(submatrix, 0, 0, 'C');
      expect(result).toBe(false);
    });
  });
});
