let Sudoku = require("./sudoku.js");

//Testing
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

// beforeAll(() => {
//   console.log("beforeAll");
// });

// afterAll(() => {
//   console.log("afterAll");
// });

// beforeEach(() => {
//   console.log("beforeEach");
// });

// afterEach(() => {
//   console.log("afterEach");
// });

test("getRowValues is working", () => {
  expect(x.getRowValues(0)).toEqual([0, 0, 0, 2, 1, 6, 0, 0, 0]);
});
