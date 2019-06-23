const data = require("./question.js");

// To track which numbers are left to fill in sudoku
let remainingNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const remainingRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const remainingColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const remainingGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// To track the number of spaces left to fill by each number
// When this is "1", fill the last available space
// When this is "0" remove the current number from "remainingNumbers"
let numberCount = {
  "1": 9,
  "2": 9,
  "3": 9,
  "4": 9,
  "5": 9,
  "6": 9,
  "7": 9,
  "8": 9,
  "9": 9
};

// Same logic as above. To track the number of elements in each row
let rowCount = {
  "0": 9,
  "1": 9,
  "2": 9,
  "3": 9,
  "4": 9,
  "5": 9,
  "6": 9,
  "7": 9,
  "8": 9
};

// Same logic as above. To track the number of elements in each column
let columnCount = {
  "0": 9,
  "1": 9,
  "2": 9,
  "3": 9,
  "4": 9,
  "5": 9,
  "6": 9,
  "7": 9,
  "8": 9
};

// Same logic as above. To track the number of elements in each grid
let gridCount = {
  "0": 9,
  "1": 9,
  "2": 9,
  "3": 9,
  "4": 9,
  "5": 9,
  "6": 9,
  "7": 9,
  "8": 9
};

const ifNumberExistsInRow = (rowNum, num) => {
  // Should return true if number exists in a specific row
  return data[rowNum].includes(num);
};

const ifNumberExistsInColumn = (colNum, num) => {
  // Should return true if number exists in a specific column
  return getColumnValues(colNum).includes(num);
};

const ifNumberExistsInGrid = (gridNum, num) => {
  // Should return true if number exists in a specific grid
  return getGridValues(gridNum).includes(num);
};

const getRowValues = rowNum => {
  return data[rowNum];
};

const getColumnValues = colNum => {
  let arr = [];
  data.forEach(d => {
    arr.push(d[colNum]);
  });
  return arr;
};

const getRowValuesForAGrid = (rowNum, gridNum, arr) => {
  let arrValues = getRowValues(rowNum);
  if (gridNum % 3 === 0) {
    arr.push(arrValues.slice(0, 3));
  } else if (gridNum % 3 === 1) {
    arr.push(arrValues.slice(3, 6));
  } else if (gridNum % 3 === 2) {
    arr.push(arrValues.slice(6));
  }
};

const getGridValues = gridNum => {
  let arr = [];

  if (gridNum < 3) {
    [0, 1, 2].forEach(d => {
      getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 6) {
    [3, 4, 5].forEach(d => {
      getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 9) {
    [6, 7, 8].forEach(d => {
      getRowValuesForAGrid(d, gridNum, arr);
    });
  }
  return arr.flat();
};

const getGridNumberFromRowCoumnNumbers = (rowNum, colNum) => {
  if (rowNum < 3) {
    if (colNum < 3) {
      return 0;
    } else if (colNum < 6) {
      return 1;
    } else if (colNum < 9) {
      return 2;
    }
  } else if (rowNum < 6) {
    if (colNum < 3) {
      return 3;
    } else if (colNum < 6) {
      return 4;
    } else if (colNum < 9) {
      return 5;
    }
  } else if (rowNum < 9) {
    if (colNum < 3) {
      return 6;
    } else if (colNum < 6) {
      return 7;
    } else if (colNum < 9) {
      return 8;
    }
  }
};

const fillNumberInSudoku = (num, rowNum, colNum) => {
  // Fill the number
  // Reduce the count for the number
  // If the count is 1, invoke logic to fill the last available space
  // If the count is 0, remove it from remaining numbers
  let currentGridNum = getGridNumberFromRowCoumnNumbers(rowNum, colNum);

  if (data[rowNum][colNum] === 0) {
    data[rowNum][colNum] = num;
    console.log(`\nfilled number ${num} in row ${rowNum}, column ${colNum}`);
    // console.log(data);
    console.log(
      `before counts are number: ${numberCount[num]}, row: ${
        rowCount[rowNum]
      }, column: ${columnCount[colNum]}, grid: ${gridCount[currentGridNum]}`
    );
  }

  numberCount[num]--;
  rowCount[rowNum]--;
  columnCount[colNum]--;
  gridCount[currentGridNum]--;

  if (numberCount[num] === 1) {
    checkEverywhereForANumber(num);
  } else if (numberCount[num] === 0) {
    remainingNumbers.delete(num);
  }

  if (rowCount[rowNum] == 1) {
    //fill the remaining number in that row
    remainingNumbers.forEach(num => {
      checkInRow(rowNum, num);
    });
  }

  if (columnCount[colNum] == 1) {
    //fill the remaining number in that column
    remainingNumbers.forEach(num => {
      checkInColumn(colNum, num);
    });
  }

  if (gridCount[currentGridNum] == 1) {
    //remove the remaining number in the grid
    remainingNumbers.forEach(num => {
      checkInGrid(currentGridNum, num);
    });
  }

  console.log(
    `after counts are number: ${numberCount[num]}, row ${
      rowCount[rowNum]
    }, column ${columnCount[colNum]}, grid: ${gridCount[currentGridNum]}`
  );
};

const initializeNumberCount = data => {
  // This will initialize the number count based on the given question

  // Adding 0 to the numberCount to avoid checking in the below
  // loop whether the number is "0" or actually a number
  // This key will be deleted once the operation is done

  numberCount["0"] = 81;

  data.forEach(row => {
    row.forEach(num => {
      numberCount[num] = numberCount[num] - 1;
    });
  });

  delete numberCount["0"];
};

const initializeRowCount = data => {
  // This will initialize the row count based on the given question

  data.forEach((row, rowNum) => {
    row.forEach(num => {
      if (num !== 0) {
        rowCount[rowNum]--;
      }
    });
  });
};

const initializeColumnCount = () => {
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(colNum => {
    getColumnValues(colNum).forEach(num => {
      if (num !== 0) {
        columnCount[colNum]--;
      }
    });
  });
};

const initializeGridCount = () => {
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(gridNum => {
    getGridValues(gridNum).forEach(num => {
      if (num !== 0) {
        gridCount[gridNum]--;
      }
    });
  });
};

const initializeSetup = data => {
  initializeNumberCount(data);
  initializeRowCount(data);
  initializeColumnCount();
  initializeGridCount();
};

const solveSudoku = data => {
  initializeSetup(data);
  checkAllRowsForRemainingNumbers();
  checkAllColumnsForRemainingNumbers();
  checkAllGridsForRemainingNumbers();
};

const getPossibleGridNumbersFromRowNumber = rowNum => {
  if (rowNum < 3) {
    return [0, 1, 2];
  } else if (rowNum < 6) {
    return [3, 4, 5];
  } else if (rowNum < 9) {
    return [6, 7, 8];
  }
};

const getPossibleGridNumbersFromColumnNumber = colNum => {
  if (colNum < 3) {
    return [0, 3, 6];
  } else if (colNum < 6) {
    return [1, 4, 7];
  } else if (colNum < 9) {
    return [2, 5, 8];
  }
};

const helper1 = num => {
  if ([0, 3, 6].includes(num)) {
    return [0, 1, 2];
  } else if ([1, 4, 7].includes(num)) {
    return [3, 4, 5];
  } else if ([2, 5, 8].includes(num)) {
    return [6, 7, 8];
  }
};

const helper2 = num => {
  if ([0, 3, 6].includes(num)) {
    return [0, 3, 6];
  } else if ([1, 4, 7].includes(num)) {
    return [1, 4, 7];
  } else if ([2, 5, 8].includes(num)) {
    return [2, 5, 8];
  }
};

const getPossibleRowNumbersFromGridNumber = gridNum => {
  return helper1(gridNum);
};

const getPossibleColumnNumbersFromGridNumber = gridNum => {
  if (gridNum < 3) {
    return [0, 1, 2];
  } else if (gridNum < 6) {
    return [3, 4, 5];
  } else if (gridNum < 9) {
    return [6, 7, 8];
  }
};

const getNumbersToRemoveBasedOnRow = rowNum => {
  return helper1(rowNum);
};

const getNumbersToRemoveBasedOnColumn = colNum => {
  return helper2(colNum);
};

const getEmptyPositionsFromRow = rowNum => {
  let arr = [];
  getRowValues(rowNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

const getEmptyPositionsFromColumn = colNum => {
  let arr = [];
  getColumnValues(colNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

const getEmptyPositionsFromGrid = gridNum => {
  let arr = [];
  getGridValues(gridNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

const getPossibleRowsAndColumnsFromGridNumber = gridNum => {
  return [
    getPossibleColumnNumbersFromGridNumber(gridNum),
    getPossibleRowNumbersFromGridNumber(gridNum)
  ];
};

const getRowAndColumnNumFromGridNumAndPosition = (
  gridNum,
  posNum,
  possRows,
  possCols
) => {
  let row;
  let col;
  if ([0, 1, 2].includes(posNum)) {
    row = possRows[0];
  } else if ([3, 4, 5].includes(posNum)) {
    row = possRows[1];
  } else if ([6, 7, 8].includes(posNum)) {
    row = possRows[2];
  }

  if ([0, 3, 6].includes(posNum)) {
    col = possCols[0];
  } else if ([1, 4, 7].includes(posNum)) {
    col = possCols[1];
  } else if ([2, 5, 8].includes(posNum)) {
    col = possCols[2];
  }

  return [row, col];
};

function removeElementsFromArray(arr, elements) {
  return arr.filter(num => !elements.includes(num));
}

/**
 * Should check and fill numbers in a specific row
 * @param {*} rowNum
 * @param {*} num
 */
const checkInRow = (rowNum, num) => {
  if (!ifNumberExistsInRow(rowNum, num)) {
    let emptyPositions = getEmptyPositionsFromRow(rowNum);

    // Check in grids first if number is present.
    // If yes, remove the specific positions from emptyPositions

    currentGridsForRow = getPossibleGridNumbersFromRowNumber(rowNum);

    currentGridsForRow.forEach(gridNum => {
      if (ifNumberExistsInGrid(gridNum, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getPossibleRowNumbersFromGridNumber(gridNum)
        );
      }
    });

    let elemToBeRemoved = [];

    // Check in columns now for empty positions available
    emptyPositions.forEach(d => {
      if (ifNumberExistsInColumn(d, num)) {
        elemToBeRemoved.push(d);
      }
    });

    emptyPositions = removeElementsFromArray(emptyPositions, elemToBeRemoved);

    // console.log(rowNum, num, emptyPositions);

    // Fill the number in Sudoku if there is only one possibility
    if (emptyPositions.length == 1) {
      fillNumberInSudoku(num, rowNum, emptyPositions[0]);
    }
  }
};

/**
 * Should check and fill numbers in a specific column
 * @param {*} colNum
 * @param {*} num
 */
const checkInColumn = (colNum, num) => {
  if (!ifNumberExistsInColumn(colNum, num)) {
    let emptyPositions = getEmptyPositionsFromColumn(colNum);

    // Check in grids first if number is present.
    // If yes, remove the specific positions from emptyPositions

    currentGridsForColumn = getPossibleGridNumbersFromColumnNumber(colNum);

    currentGridsForColumn.forEach(gridNum => {
      if (ifNumberExistsInGrid(gridNum, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getPossibleColumnNumbersFromGridNumber(gridNum)
        );
      }
    });

    let elemToBeRemoved = [];

    // Check in columns now for empty positions available
    emptyPositions.forEach(d => {
      if (ifNumberExistsInRow(d, num)) {
        elemToBeRemoved.push(d);
      }
    });

    emptyPositions = removeElementsFromArray(emptyPositions, elemToBeRemoved);

    // console.log(colNum, num, emptyPositions);

    // Fill the number in Sudoku if there is only one possibility
    if (emptyPositions.length == 1) {
      fillNumberInSudoku(num, emptyPositions[0], colNum);
    }
  }
};

/**
 * Should check and fill numbers in a specific grid
 * @param {*} gridNum
 * @param {*} num
 */
const checkInGrid = (gridNum, num) => {
  if (!ifNumberExistsInGrid(gridNum, num)) {
    let emptyPositions = getEmptyPositionsFromGrid(gridNum);
    let [
      possibleRows,
      possibleColumns
    ] = getPossibleRowsAndColumnsFromGridNumber(gridNum);

    possibleRows.forEach(row => {
      if (ifNumberExistsInRow(row, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getNumbersToRemoveBasedOnRow(row)
        );
      }
    });

    possibleColumns.forEach(col => {
      if (ifNumberExistsInColumn(col, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getNumbersToRemoveBasedOnColumn(col)
        );
      }
    });

    if (emptyPositions.length == 1) {
      let [row, col] = getRowAndColumnNumFromGridNumAndPosition(
        gridNum,
        emptyPositions[0],
        possibleRows,
        possibleColumns
      );

      fillNumberInSudoku(num, row, col);
    }
  }
};

const checkAllRowsForRemainingNumbers = () => {
  console.log("\nchecking all rows");
  remainingNumbers.forEach(num => {
    remainingRows.forEach(rowNum => {
      checkInRow(rowNum, num);
    });
  });
};

const checkAllColumnsForRemainingNumbers = () => {
  console.log("\nchecking all columns");
  remainingNumbers.forEach(num => {
    remainingColumns.forEach(colNum => {
      checkInColumn(colNum, num);
    });
  });
};

const checkAllGridsForRemainingNumbers = () => {
  console.log("\nchecking all grids");
  remainingNumbers.forEach(num => {
    remainingGrids.forEach(gridNum => {
      checkInGrid(gridNum, num);
    });
  });
};

const checkEverywhereForANumber = num => {
  remainingRows.forEach(row => {
    checkInRow(row, num);
  });
  remainingColumns.forEach(col => {
    checkInRow(col, num);
  });
  remainingGrids.forEach(grid => {
    checkInGrid(grid, num);
  });
};

solveSudoku(data);
