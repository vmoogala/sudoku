// cmd + k + 0
// cmd + k + j

let DATA = require("./question.js");

let rowMaps = {
  "1": {},
  "2": {},
  "3": {},
  "4": {},
  "5": {},
  "6": {},
  "7": {},
  "8": {},
  "9": {},
  clear: function() {
    (rowMaps["1"] = {}),
      (rowMaps["2"] = {}),
      (rowMaps["3"] = {}),
      (rowMaps["4"] = {}),
      (rowMaps["5"] = {}),
      (rowMaps["6"] = {}),
      (rowMaps["7"] = {}),
      (rowMaps["8"] = {}),
      (rowMaps["9"] = {});
  }
};

let columnMaps = {
  "1": {},
  "2": {},
  "3": {},
  "4": {},
  "5": {},
  "6": {},
  "7": {},
  "8": {},
  "9": {},
  clear: function() {
    (columnMaps["1"] = {}),
      (columnMaps["2"] = {}),
      (columnMaps["3"] = {}),
      (columnMaps["4"] = {}),
      (columnMaps["5"] = {}),
      (columnMaps["6"] = {}),
      (columnMaps["7"] = {}),
      (columnMaps["8"] = {}),
      (columnMaps["9"] = {});
  }
};

const ROW = "ROW";
const COLUMN = "COLUMN";

// To track which numbers are left to fill in sudoku
let remainingNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

// To track which rows/columns/grids to be filled
let remainingRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let remainingColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let remainingGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];

// To trigger a new cycle of row/column/grid checking whenever this count decreases
let noOfRemainingElementsToFill;

let unitPossibilitiesMap = {};
let rowPossibilitiesMap = {};
let columnPossibilitiesMap = {};
let gridPossibilitiesMap = {};

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

const print = str => console.log(str);

function removeElementsFromArray(arr, elements) {
  return arr.filter(num => !elements.includes(num));
}

function arrayEquals(a, b) {
  if (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length > 0 &&
    a.length == b.length
  ) {
    let equals = true;
    for (let i = 0; i < a.length; i++) {
      if (a[i] != b[i]) {
        equals = false;
        break;
      }
    }
    return equals;
  }
  return false;
}

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
      _getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 6) {
    [3, 4, 5].forEach(d => {
      _getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 9) {
    [6, 7, 8].forEach(d => {
      _getRowValuesForAGrid(d, gridNum, arr);
    });
  }
  return arr.flat();
};

const ifRowHasNumber = (rowNum, num) => {
  // Should return true if number exists in a specific row
  return getRowValues(rowNum).includes(num);
};

const ifColumnHasNumber = (colNum, num) => {
  // Should return true if number exists in a specific column
  return getColumnValues(colNum).includes(num);
};

const ifGridHasNumber = (gridNum, num) => {
  // Should return true if number exists in a specific grid
  return getGridValues(gridNum).includes(num);
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

const _initializeNumberCount = () => {
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

const _initializeRowCount = () => {
  // This will initialize the row count based on the given question

  DATA.forEach((row, rowNum) => {
    row.forEach(num => {
      if (num !== 0) {
        rowCount[rowNum]--;
      }
    });
  });
};

const _initializeColumnCount = () => {
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(colNum => {
    getColumnValues(colNum).forEach(num => {
      if (num !== 0) {
        columnCount[colNum]--;
      }
    });
  });
};

const _initializeGridCount = () => {
  [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(gridNum => {
    getGridValues(gridNum).forEach(num => {
      if (num !== 0) {
        gridCount[gridNum]--;
      }
    });
  });
};

const _initializeRemainingNoOfElements = () => {
  let sum = 0;
  Object.entries(numberCount).forEach(([key, value]) => {
    sum += value;
  });
  noOfRemainingElementsToFill = sum;
};

const _initializeUnitPossibilitiesMap = () => {
  for (let i = 0; i < 81; i++) {
    unitPossibilitiesMap[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  // for (let i = 0; i < 9; i++) {
  //   for (let j = 0; j < 9; j++) {
  //     if (DATA[i][j] != "0") {
  //       // updatePossibilitiesMaps(i, j, DATA[i][j]);
  //       delete unitPossibilitiesMap[getUnitNumForRowColumnNum(i, j)];
  //     }
  //   }
  // }
};

const _initializeRowPossibilitiesMap = () => {
  for (let i = 0; i < 9; i++) {
    rowPossibilitiesMap[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  remainingRows.forEach(rowNum => {
    rowValues = getRowValues(rowNum);
    rowPossibilitiesMap[rowNum] = removeElementsFromArray(
      rowPossibilitiesMap[rowNum],
      rowValues
    );
  });
};

const _initializeColumnPossibilitiesMap = () => {
  for (let i = 0; i < 9; i++) {
    columnPossibilitiesMap[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  remainingColumns.forEach(colNum => {
    columnValues = getColumnValues(colNum);
    columnPossibilitiesMap[colNum] = removeElementsFromArray(
      columnPossibilitiesMap[colNum],
      columnValues
    );
  });
};

const _initializeGridPossibilitiesMap = () => {
  for (let i = 0; i < 9; i++) {
    gridPossibilitiesMap[i] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  remainingGrids.forEach(gridNum => {
    gridValues = getGridValues(gridNum);
    gridPossibilitiesMap[gridNum] = removeElementsFromArray(
      gridPossibilitiesMap[gridNum],
      gridValues
    );
  });
};

const initializeSetup = () => {
  _initializeNumberCount();
  _initializeRowCount();
  _initializeColumnCount();
  _initializeGridCount();
  _initializeRemainingNoOfElements();

  _initializeUnitPossibilitiesMap();
  _initializeRowPossibilitiesMap();
  _initializeColumnPossibilitiesMap();
  _initializeGridPossibilitiesMap();
};

const getUnitNumForRowColumnNum = (rowNum, colNum) => {
  return rowNum * 9 + colNum;
};

const _getUnitsApplicableForRow = rowNum => {
  //rowNum 0 should give 0-8
  //rowNum 1 should give 9-17

  if (rowNum > 8) throw new Error("Invalid rowNum. Can't be greater than 8");
  let arr = [];
  let i = 9 * rowNum;
  while (arr.length < 9) {
    arr.push(i++);
  }
  return arr;
};

const _getUnitsApplicableForColumn = colNum => {
  // colNum 0 should give [0,9,18 .... 72]
  // colNum 8 should give [8,17,26 .... 80]
  if (colNum > 8) throw new Error("Invalid colNum. Can't be greater than 8");
  let arr = [];
  let current = colNum;
  while (arr.length < 9) {
    arr.push(current);
    current += 9;
  }
  return arr;
};

const _getUnitsApplicableForGrid = gridNum => {
  if (gridNum > 8) throw new Error("Invalid gridNum. Can't be greater than 8");
  let result;
  //hardcoding. to be removed
  switch (gridNum) {
    case 0:
      result = [0, 1, 2, 9, 10, 11, 18, 19, 20];
      break;
    case 1:
      result = [3, 4, 5, 12, 13, 14, 21, 22, 23];
      break;
    case 2:
      result = [6, 7, 8, 15, 16, 17, 24, 25, 26];
      break;
    case 3:
      result = [27, 28, 29, 36, 37, 38, 45, 46, 47];
      break;
    case 4:
      result = [30, 31, 32, 39, 40, 41, 48, 49, 50];
      break;
    case 5:
      result = [33, 34, 35, 42, 43, 44, 51, 52, 53];
      break;
    case 6:
      result = [54, 55, 56, 63, 64, 65, 72, 73, 74];
      break;
    case 7:
      result = [57, 58, 59, 66, 67, 68, 75, 76, 77];
      break;
    case 8:
      result = [60, 61, 62, 69, 70, 71, 78, 79, 80];
      break;
  }
  return result;
};

const getPossibilitiesForRow = rowNum => {
  let arr = [];
  _getUnitsApplicableForRow(rowNum).forEach(d => {
    if (unitPossibilitiesMap[d]) {
      arr.push(unitPossibilitiesMap[d]);
    } else {
      arr.push([]);
    }
  });
  return arr;
};

const getPossibilitiesForColumn = colNum => {
  let arr = [];
  _getUnitsApplicableForColumn(colNum).forEach(d => {
    if (unitPossibilitiesMap[d]) {
      arr.push(unitPossibilitiesMap[d]);
    } else {
      arr.push([]);
    }
  });
  return arr;
};

const removeFromUnitPossibility = (rowOrColumn, rowOrColNum, elements) => {
  console.log(
    "solving naked subset for " +
      rowOrColumn +
      " num " +
      rowOrColNum +
      ", removing elements " +
      elements
  );
  if (rowOrColumn == ROW) {
    _getUnitsApplicableForRow(rowOrColNum).forEach(d => {
      if (unitPossibilitiesMap[d]) {
        if (!arrayEquals(unitPossibilitiesMap[d], elements)) {
          // print(
          //   "intial unit possibility map for " +
          //     d +
          //     " " +
          //     unitPossibilitiesMap[d]
          // );
          unitPossibilitiesMap[d] = removeElementsFromArray(
            unitPossibilitiesMap[d],
            elements
          );
          // print(
          //   "updated unit possibility map for " +
          //     d +
          //     " " +
          //     unitPossibilitiesMap[d]
          // );
        }
      }
    });
  } else if (rowOrColumn == COLUMN) {
    _getUnitsApplicableForColumn(rowOrColNum).forEach(d => {
      if (unitPossibilitiesMap[d]) {
        if (!arrayEquals(unitPossibilitiesMap[d], elements)) {
          // print(
          //   "intial unit possibility map for " +
          //     d +
          //     " " +
          //     unitPossibilitiesMap[d]
          // );
          unitPossibilitiesMap[d] = removeElementsFromArray(
            unitPossibilitiesMap[d],
            elements
          );
          // print(
          //   "updated unit possibility map for " +
          //     d +
          //     " " +
          //     unitPossibilitiesMap[d]
          // );
        }
      }
    });
  }
};

const removeNumberFromUnitMap = (num, unitNum) => {
  if (unitPossibilitiesMap[unitNum]) {
    unitPossibilitiesMap[
      unitNum
    ] = removeElementsFromArray(unitPossibilitiesMap[unitNum], [num]);
  }
};

const updateUnitPossibilitiesMap = (num, rowNum, colNum) => {
  delete unitPossibilitiesMap[getUnitNumForRowColumnNum(rowNum, colNum)];

  //remove the number as a possibility from all units in that row
  _getUnitsApplicableForRow(rowNum).forEach(unit => {
    removeNumberFromUnitMap(num, unit);
  });

  //remove the number as possibility from all units in that columns
  _getUnitsApplicableForColumn(colNum).forEach(unit => {
    removeNumberFromUnitMap(num, unit);
  });

  //remove the number as possibility from all units in the same grid
  _getUnitsApplicableForGrid(
    getGridNumberFromRowColumnNumbers(rowNum, colNum)
  ).forEach(unit => {
    removeNumberFromUnitMap(num, unit);
  });
};

const updateRowPossibilitiesMap = (num, rowNum) => {
  rowPossibilitiesMap[rowNum] = removeElementsFromArray(
    rowPossibilitiesMap[rowNum],
    [num]
  );
};

const updateColumnPossibilitiesMap = (num, colNum) => {
  columnPossibilitiesMap[
    colNum
  ] = removeElementsFromArray(columnPossibilitiesMap[colNum], [num]);
};

const updateGridPossibilitiesMap = (num, gridNum) => {
  gridPossibilitiesMap[gridNum] = removeElementsFromArray(
    gridPossibilitiesMap[gridNum],
    [num]
  );
};

const updatePossibilitiesMaps = (num, rowNum, colNum) => {
  updateUnitPossibilitiesMap(num, rowNum, colNum);
  updateRowPossibilitiesMap(num, rowNum);
  updateColumnPossibilitiesMap(num, colNum);
  updateGridPossibilitiesMap(
    num,
    getGridNumberFromRowColumnNumbers(rowNum, colNum)
  );
};

// naked subset
const solveNakedSubset = () => {
  remainingRows.forEach(d => {
    // printPossibilitiesForNumbersInSameRow(d);
    let arr = getPossibilitiesForRow(d);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length == 2) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arrayEquals(arr[i], arr[j])) {
            removeFromUnitPossibility(ROW, d, arr[i]);
          }
        }
      }
    }
  });

  remainingColumns.forEach(d => {
    // printPossibilitiesForNumbersInSameRow(d);
    let arr = getPossibilitiesForColumn(d);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i].length == 2) {
        for (let j = i + 1; j < arr.length; j++) {
          if (arrayEquals(arr[i], arr[j])) {
            removeFromUnitPossibility(COLUMN, d, arr[i]);
          }
        }
      }
    }
  });
};

const checkForSinglePossibilityAfterEverything = () => {
  remainingColumns.forEach(colNum => {
    possibilities = getPossibilitiesForColumn(colNum);
    // print(possibilities);
    // print(remainingNumbers);
    //TODO: Extract this to a function
    remainingNumbers.forEach(num => {
      let count = 0;
      let position = 0;
      possibilities.forEach((d, i) => {
        if (d && d.includes(num)) {
          position = i;
          count++;
        }
      });
      // print("count for number " + num + "is " + count);
      if (count == 1) {
        print(
          "found only one possibility for number " +
            num +
            " in column " +
            colNum +
            " at position " +
            position
        );
        fillNumberInSudoku(num, position, colNum);
      }
    });
  });

  remainingRows.forEach(rowNum => {
    possibilities = getPossibilitiesForColumn(rowNum);
    // print(possibilities);
    // print(remainingNumbers);
    //TODO: Extract this to a function
    remainingNumbers.forEach(num => {
      let count = 0;
      let position = 0;
      possibilities.forEach((d, i) => {
        if (d && d.includes(num)) {
          position = i;
          count++;
        }
      });
      // print("count for number " + num + "is " + count);
      if (count == 1) {
        print(
          "found only one possibility for number " +
            num +
            " in row " +
            rowNum +
            " at position " +
            position
        );
        fillNumberInSudoku(num, rowNum, position);
      }
    });
  });

  //TODO: Add logic for grids
};

//Helper Function
const _getRowValuesForAGrid = (rowNum, gridNum, arr) => {
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

  if (
    ifRowHasNumber(rowNum, num) ||
    ifColumnHasNumber(colNum, num) ||
    ifGridHasNumber(currentGridNum, num)
  ) {
    throw new Error("sudoku solving failed");
  }

  if (DATA[rowNum][colNum] === 0) {
    DATA[rowNum][colNum] = num;
    updatePossibilitiesMaps(num, rowNum, colNum);
    console.log(`\nfilled number ${num} in row ${rowNum}, column ${colNum}`);
    // console.log(DATA);
    console.log(
      `before counts are number: ${numberCount[num]}, row: ${rowCount[rowNum]}, column: ${columnCount[colNum]}, grid: ${gridCount[currentGridNum]}, remainingNoOfElements: ${noOfRemainingElementsToFill}, remainingRows: ${remainingRows}, remainingColumns: ${remainingColumns}, remainingGrids: ${remainingGrids}`
    );

    numberCount[num]--;
    rowCount[rowNum]--;
    columnCount[colNum]--;
    gridCount[currentGridNum]--;
    noOfRemainingElementsToFill--;

    console.log(
      `after counts are number: ${numberCount[num]}, row ${rowCount[rowNum]}, column ${columnCount[colNum]}, grid: ${gridCount[currentGridNum]}, remaining: ${noOfRemainingElementsToFill}, remainingRows: ${remainingRows}, remainingColumns: ${remainingColumns}, remainingGrids: ${remainingGrids}`
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
      remainingRows = removeElementsFromArray(remainingRows, [rowNum]);
    }

    if (columnCount[colNum] == 1) {
      //fill the remaining number in that column
      console.log(`\nfilling the last number in the column ${colNum}`);
      remainingNumbers.forEach(num => {
        checkInColumn(colNum, num);
      });
      remainingColumns = removeElementsFromArray(remainingColumns, [colNum]);
    }

    if (gridCount[currentGridNum] == 1) {
      //remove the remaining number in the grid
      console.log(`\nfilling the last number in the grid ${currentGridNum}`);
      remainingNumbers.forEach(num => {
        checkInGrid(currentGridNum, num);
      });
      remainingGrids = removeElementsFromArray(remainingGrids, [
        currentGridNum
      ]);
    }
  }
};

function doOneCycle() {
  _checkAllRowsForRemainingNumbers();
  _checkAllColumnsForRemainingNumbers();
  _checkAllGridsForRemainingNumbers();
  checkForRemainingNumbersInAllRows();
  checkForRemainingNumbersInAllColumns();
  checkForNumbersInGridIfColumnHasRemainingNumsInSameGrid();
  solveNakedSubset();
  checkForSinglePossibilityAfterEverything();
  // parseRowColumnMapsToFillIntersections();
}

const solveSudoku = () => {
  let beforeCount;
  do {
    beforeCount = noOfRemainingElementsToFill;
    doOneCycle();
    if (noOfRemainingElementsToFill === 0) {
      break;
    }
  } while (beforeCount > noOfRemainingElementsToFill);

  /**
   * Guessing game should start here
   */

  printFinalStats();
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

const _helper1 = num => {
  if ([0, 3, 6].includes(num)) {
    return [0, 1, 2];
  } else if ([1, 4, 7].includes(num)) {
    return [3, 4, 5];
  } else if ([2, 5, 8].includes(num)) {
    return [6, 7, 8];
  }
};

const _helper2 = num => {
  if ([0, 3, 6].includes(num)) {
    return [0, 3, 6];
  } else if ([1, 4, 7].includes(num)) {
    return [1, 4, 7];
  } else if ([2, 5, 8].includes(num)) {
    return [2, 5, 8];
  }
};

const getPossibleRowNumbersFromGridNumber = gridNum => {
  return _helper1(gridNum);
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
  return _helper1(rowNum);
};

const getNumbersToRemoveBasedOnColumn = colNum => {
  return _helper2(colNum);
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

/**
 * Should check and fill numbers in a specific row
 * @param {*} rowNum
 * @param {*} num
 */
const checkInRow = (rowNum, num) => {
  if (!ifRowHasNumber(rowNum, num)) {
    let emptyPositions = getEmptyPositionsFromRow(rowNum);

    // Check in grids first if number is present.
    // If yes, remove the specific positions from emptyPositions

    currentGridsForRow = getPossibleGridNumbersFromRowNumber(rowNum);

    currentGridsForRow.forEach(gridNum => {
      if (ifGridHasNumber(gridNum, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getPossibleRowNumbersFromGridNumber(gridNum)
        );
      }
    });

    let elemToBeRemoved = [];

    // Check in columns now for empty positions available
    emptyPositions.forEach(d => {
      if (ifColumnHasNumber(d, num)) {
        elemToBeRemoved.push(d);
      }
    });

    emptyPositions = removeElementsFromArray(emptyPositions, elemToBeRemoved);

    // console.log(rowNum, num, emptyPositions);

    // Fill the number in Sudoku if there is only one possibility
    if (emptyPositions.length == 1) {
      fillNumberInSudoku(num, rowNum, emptyPositions[0]);
    } else if (emptyPositions.length === 2) {
      pushNumberToRowMaps(num, rowNum, emptyPositions);
    }
  }
};

/**
 * Should check and fill numbers in a specific column
 * @param {*} colNum
 * @param {*} num
 */
const checkInColumn = (colNum, num) => {
  if (!ifColumnHasNumber(colNum, num)) {
    let emptyPositions = getEmptyPositionsFromColumn(colNum);

    // Check in grids first if number is present.
    // If yes, remove the specific positions from emptyPositions

    currentGridsForColumn = getPossibleGridNumbersFromColumnNumber(colNum);

    currentGridsForColumn.forEach(gridNum => {
      if (ifGridHasNumber(gridNum, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getPossibleColumnNumbersFromGridNumber(gridNum)
        );
      }
    });

    let elemToBeRemoved = [];

    // Check in columns now for empty positions available
    emptyPositions.forEach(d => {
      if (ifRowHasNumber(d, num)) {
        elemToBeRemoved.push(d);
      }
    });

    emptyPositions = removeElementsFromArray(emptyPositions, elemToBeRemoved);

    // console.log(colNum, num, emptyPositions);

    // Fill the number in Sudoku if there is only one possibility
    if (emptyPositions.length == 1) {
      fillNumberInSudoku(num, emptyPositions[0], colNum);
    } else if (emptyPositions.length === 2) {
      pushNumberToColumnMaps(num, colNum, emptyPositions);
    }
  }
};

/**
 * Should check and fill numbers in a specific grid
 * @param {*} gridNum
 * @param {*} num
 */
const checkInGrid = (gridNum, num) => {
  if (!ifGridHasNumber(gridNum, num)) {
    let emptyPositions = getEmptyPositionsFromGrid(gridNum);
    let [
      possibleRows,
      possibleColumns
    ] = getPossibleRowsAndColumnsFromGridNumber(gridNum);

    possibleRows.forEach(row => {
      if (ifRowHasNumber(row, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getNumbersToRemoveBasedOnRow(row)
        );
      }
    });

    possibleColumns.forEach(col => {
      if (ifColumnHasNumber(col, num)) {
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

const _checkAllRowsForRemainingNumbers = () => {
  console.log("\nchecking all rows");
  remainingNumbers.forEach(num => {
    remainingRows.forEach(rowNum => {
      checkInRow(rowNum, num);
    });
  });
};

const _checkAllColumnsForRemainingNumbers = () => {
  console.log("\nchecking all columns");
  remainingNumbers.forEach(num => {
    remainingColumns.forEach(colNum => {
      checkInColumn(colNum, num);
    });
  });
};

const _checkAllGridsForRemainingNumbers = () => {
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
    if (returnArr[1] == ROW) {
      let row = getActualRowNumberFromGridNumAndGridRowNum(gridNum, pos1);
      // Solve for the number in grids which are in same row assuming that
      // the number cannot come in the same row as the current one
      let adjGrids = getGridNumbersInSameRow(gridNum);

      adjGrids.forEach(grid => {
        checkForNumbernInGridByExcludingRowOrColumn(ROW, num, grid, row);
      });
    } else if (returnArr[1] == COLUMN) {
      let col = getActualColumnNumberFromGridNumAndGridRowNum(gridNum, pos1);
      // Solve for the number in grids which are in same column assuming that
      // the number cannot come in the same column as the current one
      let adjGrids = getGridNumbersInSameColumn(gridNum);

      adjGrids.forEach(grid => {
        checkForNumbernInGridByExcludingRowOrColumn(COLUMN, num, grid, col);
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
        rowOrColumn = ROW;
      } else {
        rowOrColumn = COLUMN;
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
  if (!ifGridHasNumber(gridNum, num)) {
    let emptyPositions = getEmptyPositionsFromGrid(gridNum);
    let [
      possibleRows,
      possibleColumns
    ] = getPossibleRowsAndColumnsFromGridNumber(gridNum);

    possibleRows.forEach(row => {
      if (ifRowHasNumber(row, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getNumbersToRemoveBasedOnRow(row)
        );
      }
    });

    possibleColumns.forEach(col => {
      if (ifColumnHasNumber(col, num)) {
        emptyPositions = removeElementsFromArray(
          emptyPositions,
          getNumbersToRemoveBasedOnColumn(col)
        );
      }
    });

    if (rowOrColumn == ROW) {
      emptyPositions = removeElementsFromArray(
        emptyPositions,
        getNumbersToRemoveBasedOnRow(rowOrColumnNum)
      );
    } else if (rowOrColumn == COLUMN) {
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
      if (ifColumnHasNumber(pos, num) || ifGridHasNumber(gridNum, num)) {
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
      if (ifRowHasNumber(pos, num) || ifGridHasNumber(gridNum, num)) {
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

const checkForNumbersInGridExcludingColumnAndNumbers = (
  gridNum,
  colNum,
  numbers
) => {
  // console.log(gridNum, colNum, numbers);

  let remainingValues = getRemainingValuesToFillInAGrid(gridNum);
  let emptyPositions = getEmptyPositionsFromGrid(gridNum);

  emptyPositions = removeElementsFromArray(
    emptyPositions,
    getNumbersToRemoveBasedOnColumn(colNum)
  );

  remainingValues = removeElementsFromArray(remainingValues, numbers);

  // console.log(emptyPositions, remainingValues);

  emptyPositions.forEach(pos => {
    let temp1 = [...remainingValues];
    temp1.forEach(num => {
      if (!ifNumberPossibleAtAPositionInGrid(num, gridNum, pos)) {
        temp1 = temp1.filter(d => d !== num);
      }
    });
    if (temp1.length === 1) {
      // console.log(temp1[0], gridNum, pos);
      remainingValues = removeElementsFromArray(remainingValues, temp1);
      emptyPositions = removeElementsFromArray(emptyPositions, [pos]);
      let [row, col] = getRowAndColumnNumFromGridNumAndPosition(gridNum, pos);
      fillNumberInSudoku(temp1[0], row, col);
    }
  });
};

const checkForNumbersInGridIfColumnHasRemainingNumsInSameGrid = () => {
  remainingColumns.forEach(colNum => {
    if (ifRowOrColumnHasPossibilitiesInSameGrid(COLUMN, colNum)) {
      let emptyPositions = getEmptyPositionsFromColumn(colNum);
      let remainingValues = getRemainingValuesToFillInAColumn(colNum);
      let gridNum = getGridNumberFromRowColumnNumbers(
        emptyPositions[0],
        colNum
      );

      checkForNumbersInGridExcludingColumnAndNumbers(
        gridNum,
        colNum,
        remainingValues
      );
    }
  });
};

const ifRowOrColumnHasPossibilitiesInSameGrid = (rowOrColumn, rowOrColNum) => {
  let positions;

  if (rowOrColumn === ROW) {
    positions = getEmptyPositionsFromRow(rowOrColNum);
  } else {
    positions = getEmptyPositionsFromColumn(rowOrColNum);
  }
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
    ifColumnHasNumber(col, num) ||
    ifRowHasNumber(row, num) ||
    ifGridHasNumber(gridNum, num)
  ) {
    return false;
  }
  return true;
};

function pushNumberToRowMaps(num, rowNum, emptyPositions) {
  console.log(
    "number " +
      num +
      " has two possibilities in row " +
      rowNum +
      "->" +
      emptyPositions
  );

  rowMaps[num][rowNum] = emptyPositions;
}

function pushNumberToColumnMaps(num, colNum, emptyPositions) {
  console.log(
    "number " +
      num +
      " has two possibilities in column " +
      colNum +
      "->" +
      emptyPositions
  );

  columnMaps[num][colNum] = emptyPositions;
}

// After every iteration we check if a row and column has intersections,
// say 2 is only possible in Row 2 at position 2 and 4
// 2 is possible in at Column 2 at position 2 and 8.
// Now, 2 has to be at the intersection of row 2 and column 2.
// After this is done, we clear the maps
function parseRowColumnMapsToFillIntersections() {
  rowMapsKeys = Object.keys(rowMaps);

  rowMapsKeys.forEach(num => {
    currentRowPositionsForNum = rowMaps[num];
    currentColumnPositionsForNum = columnMaps[num];

    if (
      currentRowPositionsForNum != undefined &&
      currentColumnPositionsForNum != undefined
    ) {
      console.log(
        num,
        ",",
        currentRowPositionsForNum,
        ",",
        currentColumnPositionsForNum
      );

      commonForRowAndColumn = Object.keys(currentRowPositionsForNum).filter(d =>
        Object.keys(currentColumnPositionsForNum).includes(d)
      );

      if (commonForRowAndColumn.length > 0) {
        console.log(commonForRowAndColumn);
        commonForRowAndColumn.forEach(d => {
          element = currentRowPositionsForNum[d].filter(d1 =>
            currentColumnPositionsForNum[d].includes(d1)
          );
          if (element.length == 1) {
            console.log(num, d, element[0]);
            // fillNumberInSudoku(num, d, element[0]);
          }
        });
      }
    }
  });

  rowMaps.clear();
  columnMaps.clear();
}

const checkEverywhereForRemainingNumbers = () => {
  remainingNumbers.forEach(num => {
    checkEverywhereForANumber(num);
  });
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

function guessGame() {
  if (noOfRemainingElementsToFill != 0) {
    console.log("logic is not good enough. Guessing game begins");

    let oldData = JSON.parse(JSON.stringify(DATA));
    let oldremainingNumbers = new Set(remainingNumbers);
    let oldremainingRows = JSON.parse(JSON.stringify(remainingRows));
    let oldremainingColumns = JSON.parse(JSON.stringify(remainingColumns));
    let oldremainingGrids = JSON.parse(JSON.stringify(remainingGrids));
    let oldnumberCount = JSON.parse(JSON.stringify(numberCount));
    let oldrowCount = JSON.parse(JSON.stringify(rowCount));
    let oldcolumnCount = JSON.parse(JSON.stringify(columnCount));
    let oldgridCount = JSON.parse(JSON.stringify(gridCount));
    let oldnoOfRemainingElementsToFill = noOfRemainingElementsToFill;

    // guessing game
    let guessGrid;
    remainingGrids.forEach(d => {
      if (gridCount[d] == 2) {
        guessGrid = d;
      }
    });
    console.log(guessGrid);

    let vals = getRemainingValuesToFillInAGrid(guessGrid);
    console.log(vals);

    let poss = getEmptyPositionsFromGrid(guessGrid);
    console.log(poss);

    let currentCombination = [vals[0], poss[0]];
    let nextCombination = [vals[0], poss[1]];

    let [rowNum, colNum] = getRowAndColumnNumFromGridNumAndPosition(
      guessGrid,
      currentCombination[1]
    );

    console.log(rowNum, colNum);

    fillNumberInSudoku(currentCombination[0], rowNum, colNum);
    solveSudoku();

    if (noOfRemainingElementsToFill == 0) {
      console.log("success with combo 1");
    } else {
      console.log("failure with combination 1");
      DATA = JSON.parse(JSON.stringify(oldData));
      remainingNumbers = new Set(oldremainingNumbers);
      remainingRows = JSON.parse(JSON.stringify(oldremainingRows));
      remainingColumns = JSON.parse(JSON.stringify(oldremainingColumns));
      remainingGrids = JSON.parse(JSON.stringify(oldremainingGrids));
      numberCount = JSON.parse(JSON.stringify(oldnumberCount));
      rowCount = JSON.parse(JSON.stringify(oldrowCount));
      columnCount = JSON.parse(JSON.stringify(oldcolumnCount));
      gridCount = JSON.parse(JSON.stringify(oldgridCount));
      noOfRemainingElementsToFill = oldnoOfRemainingElementsToFill;

      console.log("trying with combination 2");
      console.log(guessGrid);

      let vals = getRemainingValuesToFillInAGrid(guessGrid);
      console.log(vals);

      let poss = getEmptyPositionsFromGrid(guessGrid);
      console.log(poss);

      let [rowNum, colNum] = getRowAndColumnNumFromGridNumAndPosition(
        guessGrid,
        nextCombination[1]
      );

      console.log(rowNum, colNum);

      fillNumberInSudoku(nextCombination[0], rowNum, colNum);
      solveSudoku();

      if (noOfRemainingElementsToFill == 0) {
        console.log("success with the second combo");
      }
    }
  } else {
    console.log("success with logic");
  }
}

const _initializeUnitPossibilitiesMapForFirstTime = () => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (DATA[i][j] != "0") {
        // updatePossibilitiesMaps(DATA[i][j], i, j);
        updateUnitPossibilitiesMap(DATA[i][j], i, j);
      }
    }
  }
};

initializeSetup();
_initializeUnitPossibilitiesMapForFirstTime();
solveSudoku();
// guessGame();
// print(Object.keys(unitPossibilitiesMap));
// print(Object.keys(unitPossibilitiesMap).length);
// print(unitPossibilitiesMap);
// print(rowPossibilitiesMap);
// print(columnPossibilitiesMap);
// print(gridPossibilitiesMap);

// print(_getUnitsApplicableForGrid(0));

// const printPossibilitiesForNumbersInSameRow = rowNum => {
//   _getUnitsApplicableForRow(rowNum).forEach(d => {
//     if (unitPossibilitiesMap[d]) {
//       console.log(rowNum, d, unitPossibilitiesMap[d]);
//     }
//   });
// };
