export function extractSubmatrix(
  matrix: string[][],
  row: number,
  col: number,
): {
  submatrix: string[][];
  offsets: { rowOffset: number; colOffset: number };
} {
  const rows = matrix.length;
  const cols = matrix[0].length;

  const startRow = Math.max(row - 1, 0);
  const endRow = Math.min(row + 1, rows - 1);
  const startCol = Math.max(col - 1, 0);
  const endCol = Math.min(col + 1, cols - 1);

  const submatrix: string[][] = [];

  for (let i = startRow; i <= endRow; i++) {
    const rowArray: string[] = [];
    for (let j = startCol; j <= endCol; j++) {
      rowArray.push(matrix[i][j]);
    }
    submatrix.push(rowArray);
  }

  const offsetRow = row - startRow;
  const offsetCol = col - startCol;

  return {
    submatrix,
    offsets: { rowOffset: offsetRow, colOffset: offsetCol },
  };
}

export function isElementAdjacent(
  submatrix: string[][],
  rowOffset: number,
  colOffset: number,
  target: string,
): boolean {
  const rows = submatrix.length;
  const cols = submatrix[0].length;

  // Define the directions for adjacent cells (8 possible directions)
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1], // Top-left, Top, Top-right
    [0, -1],
    [0, 1], // Left,     , Right
    [1, -1],
    [1, 0],
    [1, 1], // Bottom-left, Bottom, Bottom-right
  ];

  // Loop through all the possible directions around the given cell
  for (const [dx, dy] of directions) {
    const newRow = rowOffset + dx;
    const newCol = colOffset + dy;

    // Check if the adjacent cell is in bounds and equals the target
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      if (submatrix[newRow][newCol] === target) {
        return true;
      }
    }
  }

  // If no adjacent cell matches the target number, return false
  return false;
}
