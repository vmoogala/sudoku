const data = require("./question.js");

// To track which numbers are left to fill in sudoku
let remainingNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

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

const checkInRow = (rowNum, num) => {
  // Should check and fill numbers in a specific row
};

const checkInColumn = (colNum, num) => {
  // Should check and fill numbers in a specific column
};

const checkInGrid = (gridNum, num) => {
  // Should check and fill numbers in a specific grid
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
  return arr;
};

const fillNumberInSudoku = (num, rowNum, colNum) => {
  // Fill the number
  // Reduce the count for the number
  // If the count is 1, invoke logic to fill the last available space
  // If the count is 0, remove it from remaining numbers

  if (--rowCount[rowNum] == 1) {
    //fill the remaining number in that row
  }

  if (--columnCount[colNum] == 1) {
    //fill the remaining number in that column
  }
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

const initializeSetup = data => {
  initializeNumberCount(data);
  initializeRowCount(data);
  initializeColumnCount();
};

const solveSudoku = data => {
  initializeSetup(data);
};

solveSudoku(data);
