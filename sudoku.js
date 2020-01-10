class Sudoku {
  constructor(data) {
    this.DATA = data;
    this.remainingNumbers = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    this.remainingRows = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.remainingColumns = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.remainingGrids = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    this.numberCount = {
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
    this.rowCount = {
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
    this.columnCount = {
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
    this.gridCount = {
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

    // initializeSetup();
  }

  initializeNumberCount = function() {
    // This will initialize the number count based on the given question

    // Adding 0 to the numberCount to avoid checking in the below
    // loop whether the number is "0" or actually a number
    // This key will be deleted once the operation is done

    this.numberCount["0"] = 81;

    this.DATA.forEach(row => {
      row.forEach(num => {
        this.numberCount[num] = this.numberCount[num] - 1;
      });
    });

    delete this.numberCount["0"];
  };

  initializeRowCount = function() {
    // This will initialize the row count based on the given question

    this.DATA.forEach((row, rowNum) => {
      row.forEach(num => {
        if (num !== 0) {
          this.rowCount[rowNum]--;
        }
      });
    });
  };

  initializeColumnCount = function() {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(colNum => {
      this.getColumnValues(colNum).forEach(num => {
        if (num !== 0) {
          this.columnCount[colNum]--;
        }
      });
    });
  };

  initializeGridCount = function() {
    [0, 1, 2, 3, 4, 5, 6, 7, 8].forEach(gridNum => {
      this.getGridValues(gridNum).forEach(num => {
        if (num !== 0) {
          this.gridCount[gridNum]--;
        }
      });
    });
  };

  initializeRemainingNoOfElements = function() {
    let sum = 0;
    Object.entries(this.numberCount).forEach(([key, value]) => {
      sum += value;
    });
    this.noOfRemainingElementsToFill = sum;
  };

  initializeSetup = function() {
    this.initializeNumberCount();
    this.initializeRowCount();
    this.initializeColumnCount();
    this.initializeGridCount();
    this.initializeRemainingNoOfElements();
  };

  printFinalStats = function() {
    console.log("remaining Numbers --> " + this.remainingNumbers.size);
    console.log("remaining Rows --> " + this.remainingRows);
    console.log("remaining Columns --> " + this.remainingColumns);
    console.log("remaining Grids --> " + this.remainingGrids);

    console.log(
      "number of elements left to fill --> " + this.noOfRemainingElementsToFill
    );
  };
}

Sudoku.prototype.getRowValues = function(rowNum) {
  return this.DATA[rowNum];
};

Sudoku.prototype.getColumnValues = function(colNum) {
  let arr = [];
  this.DATA.forEach(d => {
    arr.push(d[colNum]);
  });
  return arr;
};

Sudoku.prototype.ifRowHasNumber = function(rowNum, num) {
  // Should return true if number exists in a specific row
  return this.getRowValues(rowNum).includes(num);
};

Sudoku.prototype.ifColumnHasNumber = function(colNum, num) {
  // Should return true if number exists in a specific column
  return this.getColumnValues(colNum).includes(num);
};

Sudoku.prototype.ifGridHasNumber = function(gridNum, num) {
  // Should return true if number exists in a specific grid
  return this.getGridValues(gridNum).includes(num);
};

Sudoku.prototype.getEmptyPositionsFromRow = function(rowNum) {
  let arr = [];
  this.getRowValues(rowNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

Sudoku.prototype.getEmptyPositionsFromColumn = function(colNum) {
  let arr = [];
  this.getColumnValues(colNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

Sudoku.prototype.getEmptyPositionsFromGrid = function(gridNum) {
  let arr = [];
  this.getGridValues(gridNum).forEach((d, i) => {
    if (d === 0) {
      arr.push(i);
    }
  });
  return arr;
};

/**
 * To improve this
 */

// Thsi function is only being called from getGridValues. Needs to be private to it
Sudoku.prototype.getRowValuesForAGrid = function(rowNum, gridNum, arr) {
  let arrValues = this.getRowValues(rowNum);
  if (gridNum % 3 === 0) {
    arr.push(arrValues.slice(0, 3));
  } else if (gridNum % 3 === 1) {
    arr.push(arrValues.slice(3, 6));
  } else if (gridNum % 3 === 2) {
    arr.push(arrValues.slice(6));
  }
};

Sudoku.prototype.getGridValues = function(gridNum) {
  let arr = [];

  if (gridNum < 3) {
    [0, 1, 2].forEach(d => {
      this.getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 6) {
    [3, 4, 5].forEach(d => {
      this.getRowValuesForAGrid(d, gridNum, arr);
    });
  } else if (gridNum < 9) {
    [6, 7, 8].forEach(d => {
      this.getRowValuesForAGrid(d, gridNum, arr);
    });
  }
  return arr.flat();
};

module.exports = Sudoku;

const data = [
  [0, 0, 0, 2, 1, 6, 0, 0, 0],
  [0, 1, 0, 7, 0, 0, 2, 0, 0],
  [0, 0, 0, 4, 0, 0, 0, 3, 0],
  [2, 8, 9, 0, 0, 0, 0, 0, 5],
  [7, 0, 0, 0, 0, 0, 0, 0, 3],
  [3, 0, 0, 0, 0, 0, 7, 8, 6],
  [0, 9, 0, 0, 0, 3, 0, 0, 0],
  [0, 0, 6, 0, 0, 5, 0, 4, 0],
  [0, 0, 0, 8, 9, 4, 0, 0, 0]
];

let x = new Sudoku(data);
x.initializeSetup();
x.printFinalStats();
