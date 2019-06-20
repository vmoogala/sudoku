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

const getColumnValues = colNum => {
  let arr = [];
  data.forEach(d => {
    arr.push(d[colNum]);
  });
  return arr;
};

const getGridValues = gridNum => {};

const fillNumberInSudoku = (num, rowNum, colNum) => {
  // Fill the number
  // Reduce the count for the number
  // If the count is 1, invoke logic to fill the last available space
  // If the count is 0, remove it from remaining numbers
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

const solveSudoku = data => {
  initializeNumberCount(data);
};

solveSudoku(data);
