const DATA = require("./question.js");

// To track which numbers are left to fill in sudoku
let remainingNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

// To track which rows/columns/grids to be filled
const remainingRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const remainingColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const remainingGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// To trigger a new cycle of row/column/grid checking whenever this count decreases
let noOfRemainingElementsToFill;

// To track the number of spaces left to fill by each number
// When this is "1", fill the last space to be filled by that number
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
  return DATA[rowNum].includes(num);
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
  return DATA[rowNum];
};

const getColumnValues = colNum => {
  let arr = [];
  DATA.forEach(d => {
    arr.push(d[colNum]);
  });
  return arr;
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

//Helper Function
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

const getGridNumberFromRowColumnNumbers = (rowNum, colNum) => {
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
  let currentGridNum = getGridNumberFromRowColumnNumbers(rowNum, colNum);

  if (DATA[rowNum][colNum] === 0) {
    DATA[rowNum][colNum] = num;
    console.log(`\nfilled number ${num} in row ${rowNum}, column ${colNum}`);
    // console.log(DATA);
    console.log(
      `before counts are number: ${numberCount[num]}, row: ${
        rowCount[rowNum]
      }, column: ${columnCount[colNum]}, grid: ${
        gridCount[currentGridNum]
      }, remaining: ${noOfRemainingElementsToFill}`
    );

    numberCount[num]--;
    rowCount[rowNum]--;
    columnCount[colNum]--;
    gridCount[currentGridNum]--;
    noOfRemainingElementsToFill--;

    console.log(
      `after counts are number: ${numberCount[num]}, row ${
        rowCount[rowNum]
      }, column ${columnCount[colNum]}, grid: ${
        gridCount[currentGridNum]
      }, remaining: ${noOfRemainingElementsToFill}`
    );

    if (numberCount[num] === 1) {
      console.log(`filling the number ${num} at the last location`);
      checkEverywhereForANumber(num);
    } else if (numberCount[num] === 0) {
      console.log(`deleting the number ${num} from remaining numbers`);
      remainingNumbers.delete(num);
    }

    if (rowCount[rowNum] == 1) {
      //fill the remaining number in that row
      console.log(`\nfilling the last number in the row ${rowNum}`);
      remainingNumbers.forEach(num => {
        checkInRow(rowNum, num);
      });
    }

    if (columnCount[colNum] == 1) {
      //fill the remaining number in that column
      console.log(`\nfilling the last number in the column ${colNum}`);
      remainingNumbers.forEach(num => {
        checkInColumn(colNum, num);
      });
    }

    if (gridCount[currentGridNum] == 1) {
      //remove the remaining number in the grid
      console.log(`\nfilling the last number in the grid ${currentGridNum}`);
      remainingNumbers.forEach(num => {
        checkInGrid(currentGridNum, num);
      });
    }
  }
};

const initializeNumberCount = () => {
  // This will initialize the number count based on the given question

  // Adding 0 to the numberCount to avoid checking in the below
  // loop whether the number is "0" or actually a number
  // This key will be deleted once the operation is done

  numberCount["0"] = 81;

  DATA.forEach(row => {
    row.forEach(num => {
      numberCount[num] = numberCount[num] - 1;
    });
  });

  delete numberCount["0"];
};

const initializeRowCount = () => {
  // This will initialize the row count based on the given question

  DATA.forEach((row, rowNum) => {
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

const initializeSetup = () => {
  initializeNumberCount();
  initializeRowCount();
  initializeColumnCount();
  initializeGridCount();
  noOfRemainingElementsToFill = getRemainingNoOfElementsToFill();
};

function doOneCycle() {
  checkAllRowsForRemainingNumbers();
  checkAllColumnsForRemainingNumbers();
  checkAllGridsForRemainingNumbers();
  checkForRemainingNumbersInAllRows();
  checkForRemainingNumbersInAllColumns();
}

const solveSudoku = () => {
  initializeSetup();
  let beforeCount;
  do {
    beforeCount = noOfRemainingElementsToFill;
    doOneCycle();
  } while (beforeCount > noOfRemainingElementsToFill);

  printFinalStats();
};

const getRemainingNoOfElementsToFill = () => {
  let sum = 0;
  Object.entries(numberCount).forEach(([key, value]) => {
    sum += value;
  });
  return sum;
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

const getRowAndColumnNumFromGridNumAndPosition = (gridNum, posNum) => {
  let [possRows, possCols] = getPossibleRowsAndColumnsFromGridNumber(gridNum);
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

    if (emptyPositions.length === 1) {
      let [row, col] = getRowAndColumnNumFromGridNumAndPosition(
        gridNum,
        emptyPositions[0]
      );

      fillNumberInSudoku(num, row, col);
    } else if (emptyPositions.length === 2) {
      checkForNumberInAdjacentSpaces(gridNum, num, emptyPositions);
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

/**
 * If a grid has a possibility of a number on the same row or column,
 * check for that number in adjacent grids/rows and columns
 */
const checkForNumberInAdjacentSpaces = (gridNum, num, emptyPositions) => {
  console.log(
    `only two possibilities for ${num} in ${gridNum}. positions: ${emptyPositions}`
  );

  let pos1 = emptyPositions[0];
  let pos2 = emptyPositions[1];

  //might not be required
  if (pos1 > pos2) {
    [pos1, pos2] = [pos2, pos1];
  }

  let returnArr = arePossibilitiesOfNumberInAGridAreInSameRowOrColumn(
    pos1,
    pos2
  );

  if (returnArr[0]) {
    if (returnArr[1] == "row") {
      let row = getActualRowNumberFromGridNumAndGridRowNum(gridNum, pos1);
      // Solve for the number in grids which are in same row assuming that
      // the number cannot come in the same row as the current one
      let adjGrids = getGridNumbersInSameRow(gridNum);

      adjGrids.forEach(grid => {
        checkForNumbernInGridByExcludingRowOrColumn("row", num, grid, row);
      });
    } else if (returnArr[1] == "column") {
      let col = getActualColumnNumberFromGridNumAndGridRowNum(gridNum, pos1);
      // Solve for the number in grids which are in same column assuming that
      // the number cannot come in the same column as the current one
      let adjGrids = getGridNumbersInSameColumn(gridNum);

      adjGrids.forEach(grid => {
        checkForNumbernInGridByExcludingRowOrColumn("column", num, grid, col);
      });
    }
  }
};

const arePossibilitiesOfNumberInAGridAreInSameRowOrColumn = (a, b) => {
  let flag = false;
  let rowOrColumn;
  let chances = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8]
  ];

  for (let i = 0; i < chances.length; i++) {
    if (chances[i].includes(a) && chances[i].includes(b)) {
      flag = true;

      if (i < 3) {
        rowOrColumn = "row";
      } else {
        rowOrColumn = "column";
      }

      break;
    }
  }

  return [flag, rowOrColumn];
};

const getActualRowNumberFromGridNumAndGridRowNum = (gridNum, pos) => {
  let row = 0;
  if (gridNum < 3) {
    row += 0;
  } else if (gridNum < 6) {
    row += 3;
  } else if (gridNum < 9) {
    row += 6;
  }

  if (pos < 3) {
    row += 0;
  } else if (pos < 6) {
    row += 1;
  } else if (pos < 9) {
    row += 2;
  }

  return row;
};

const getActualColumnNumberFromGridNumAndGridRowNum = (gridNum, pos) => {
  let col = 0;

  if ([0, 3, 6].includes(gridNum)) {
    col += 0;
  } else if ([1, 4, 7].includes(gridNum)) {
    col += 3;
  } else if ([2, 5, 8].includes(gridNum)) {
    col += 6;
  }

  if ([0, 3, 6].includes(pos)) {
    col += 0;
  } else if ([1, 4, 7].includes(pos)) {
    col += 1;
  } else if ([2, 5, 8].includes(pos)) {
    col += 2;
  }

  return col;
};

//Very dirty method, should be cleaned
const checkForNumbernInGridByExcludingRowOrColumn = (
  rowOrColumn,
  num,
  gridNum,
  rowOrColumnNum
) => {
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

    if (rowOrColumn == "row") {
      emptyPositions = removeElementsFromArray(
        emptyPositions,
        getNumbersToRemoveBasedOnRow(rowOrColumnNum)
      );
    } else if (rowOrColumn == "column") {
      emptyPositions = removeElementsFromArray(
        emptyPositions,
        getNumbersToRemoveBasedOnColumn(rowOrColumnNum)
      );
    }

    if (emptyPositions.length === 1) {
      let [row, col] = getRowAndColumnNumFromGridNumAndPosition(
        gridNum,
        emptyPositions[0]
      );

      fillNumberInSudoku(num, row, col);
    }
  }
};

const getGridNumbersInSameRow = gridNum => {
  let arr;

  if ([0, 1, 2].includes(gridNum)) {
    arr = [0, 1, 2];
  } else if ([3, 4, 5].includes(gridNum)) {
    arr = [3, 4, 5];
  } else if ([6, 7, 8].includes(gridNum)) {
    arr = [6, 7, 8];
  }

  return arr.filter(num => num !== gridNum);
};

const getGridNumbersInSameColumn = gridNum => {
  let arr;

  if ([0, 3, 6].includes(gridNum)) {
    arr = [0, 3, 6];
  } else if ([1, 4, 7].includes(gridNum)) {
    arr = [1, 4, 7];
  } else if ([2, 5, 8].includes(gridNum)) {
    arr = [2, 5, 8];
  }

  return arr.filter(num => num !== gridNum);
};

const getRemainingValuesToFillInARow = rowNum => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let temp = [];

  getRowValues(rowNum).forEach(num => {
    if (num !== 0) {
      temp.push(num);
    }
  });

  arr = removeElementsFromArray(arr, temp);

  return arr;
};

// TODO: combine the logic with the above function
const getRemainingValuesToFillInAColumn = colNum => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let temp = [];

  getColumnValues(colNum).forEach(num => {
    if (num !== 0) {
      temp.push(num);
    }
  });

  arr = removeElementsFromArray(arr, temp);

  return arr;
};

const getRemainingValuesToFillInAGrid = gridNum => {
  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let temp = [];

  getGridValues(gridNum).forEach(num => {
    if (num !== 0) {
      temp.push(num);
    }
  });

  arr = removeElementsFromArray(arr, temp);

  return arr;
};

const checkForRemainingNumbersInRow = rowNum => {
  let remainingValues = getRemainingValuesToFillInARow(rowNum);
  let emptyPositions = getEmptyPositionsFromRow(rowNum);

  emptyPositions.forEach(pos => {
    let gridNum = getGridNumberFromRowColumnNumbers(rowNum, pos);
    let remainingNumbers = [...remainingValues];
    // console.log(pos, remainingNumbers);
    remainingNumbers.forEach(num => {
      if (
        ifNumberExistsInColumn(pos, num) ||
        ifNumberExistsInGrid(gridNum, num)
      ) {
        // console.log("removing number " + num);
        remainingNumbers = remainingNumbers.filter(d => d !== num);
      }
    });
    // console.log(pos, remainingNumbers);
    if (remainingNumbers.length == 1) {
      // console.log(remainingNumbers);

      remainingValues = removeElementsFromArray(
        remainingValues,
        remainingNumbers
      );

      fillNumberInSudoku(remainingNumbers[0], rowNum, pos);
    }
  });
};

const checkForRemainingNumbersInColumn = colNum => {
  let remainingValues = getRemainingValuesToFillInAColumn(colNum);
  let emptyPositions = getEmptyPositionsFromColumn(colNum);

  emptyPositions.forEach(pos => {
    let gridNum = getGridNumberFromRowColumnNumbers(pos, colNum);
    let remainingNumbers = [...remainingValues];
    // console.log(pos, remainingNumbers);
    remainingNumbers.forEach(num => {
      if (ifNumberExistsInRow(pos, num) || ifNumberExistsInGrid(gridNum, num)) {
        // console.log("removing number " + num);
        remainingNumbers = remainingNumbers.filter(d => d !== num);
      }
    });
    // console.log(pos, remainingNumbers);
    if (remainingNumbers.length == 1) {
      // console.log(remainingNumbers);

      remainingValues = removeElementsFromArray(
        remainingValues,
        remainingNumbers
      );

      fillNumberInSudoku(remainingNumbers[0], pos, colNum);
    }
  });
};

const checkForRemainingNumbersInAllRows = () => {
  console.log("\nchecking all rows for remaining numbers");
  remainingRows.forEach(row => checkForRemainingNumbersInRow(row));
};

const checkForRemainingNumbersInAllColumns = () => {
  console.log("\nchecking all columns for remaining numbers");
  remainingColumns.forEach(col => checkForRemainingNumbersInColumn(col));
};

const ifColumnHasPossibilitiesInSameGrid = colNum => {
  let positions = getEmptyPositionsFromColumn(colNum);
  if (positions.length <= 3 && positions.length > 1) {
    positions.sort();
    let first = positions[0];
    let last = positions[positions.length - 1];
    if (
      (last <= 2 && first >= 0) ||
      (last <= 5 && first >= 3) ||
      (last <= 8 && first >= 6)
    ) {
      return true;
    } else {
      return false;
    }
  }
  return false;
};

const ifNumberPossibleAtAPositionInGrid = (num, gridNum, posNum) => {
  let [row, col] = getRowAndColumnNumFromGridNumAndPosition(gridNum, posNum);
  if (
    ifNumberExistsInColumn(col, num) ||
    ifNumberExistsInRow(row, num) ||
    ifNumberExistsInGrid(gridNum, num)
  ) {
    return false;
  }
  return true;
};

function prettyPrintData() {
  console.log("");
  for (let i = 0; i < DATA.length; i++) {
    console.log(DATA[i].join("  "));
  }
  console.log("");
}

function printFinalStats() {
  console.log("\n######## Solving done");
  prettyPrintData();
  console.log("remaining Numbers --> " + remainingNumbers.size);
  console.log("remaining Rows --> " + remainingRows);
  console.log("remaining Columns --> " + remainingColumns);
  console.log("remaining Grids --> " + remainingGrids);

  console.log(
    "number of elements left to fill --> " + noOfRemainingElementsToFill
  );
}

solveSudoku();
