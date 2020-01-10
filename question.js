//Representation of sudoku for simplicity purpose
//easy in book #56
// const data = [
//   [0, 0, 0, 2, 1, 6, 0, 0, 0],
//   [0, 1, 0, 7, 0, 0, 2, 0, 0],
//   [0, 0, 0, 4, 0, 0, 0, 3, 0],
//   [2, 8, 9, 0, 0, 0, 0, 0, 5],
//   [7, 0, 0, 0, 0, 0, 0, 0, 3],
//   [3, 0, 0, 0, 0, 0, 7, 8, 6],
//   [0, 9, 0, 0, 0, 3, 0, 0, 0],
//   [0, 0, 6, 0, 0, 5, 0, 4, 0],
//   [0, 0, 0, 8, 9, 4, 0, 0, 0]
// ];

// Easy in app
// const data = [
//   [0, 0, 0, 0, 0, 5, 4, 0, 9],
//   [4, 5, 1, 0, 0, 2, 3, 0, 0],
//   [9, 8, 2, 0, 0, 0, 5, 6, 1],
//   [6, 0, 7, 0, 0, 0, 9, 8, 0],
//   [0, 0, 3, 4, 6, 0, 0, 0, 0],
//   [5, 0, 0, 2, 8, 7, 0, 1, 0],
//   [0, 4, 0, 0, 7, 0, 0, 9, 6],
//   [3, 0, 0, 0, 0, 0, 7, 0, 0],
//   [0, 0, 5, 9, 4, 6, 8, 0, 2]
// ];

//medium in app
// const data = [
//   [6, 4, 0, 0, 3, 0, 0, 0, 7],
//   [5, 0, 1, 0, 7, 0, 9, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 1, 0],
//   [0, 0, 4, 9, 0, 8, 0, 6, 0],
//   [0, 8, 0, 0, 0, 3, 0, 2, 0],
//   [0, 0, 0, 4, 0, 0, 0, 0, 0],
//   [4, 0, 0, 1, 5, 7, 0, 3, 0],
//   [2, 0, 8, 3, 0, 0, 0, 4, 0],
//   [7, 5, 0, 0, 0, 0, 0, 9, 6]
// ];

//medium in app
// const data = [
//   [5, 0, 1, 4, 0, 9, 0, 0, 7],
//   [6, 0, 0, 0, 5, 0, 0, 8, 3],
//   [8, 0, 0, 0, 0, 6, 0, 0, 0],
//   [0, 0, 0, 2, 3, 0, 0, 1, 0],
//   [0, 0, 0, 0, 0, 0, 6, 3, 9],
//   [7, 0, 3, 0, 9, 0, 4, 0, 0],
//   [0, 0, 0, 1, 0, 5, 0, 0, 2],
//   [0, 8, 0, 0, 2, 0, 0, 0, 0],
//   [0, 6, 0, 0, 0, 3, 5, 4, 0]
// ];

// hard in app
// const data = [
//   [0, 4, 0, 0, 0, 0, 9, 0, 0],
//   [0, 6, 8, 0, 1, 3, 0, 0, 0],
//   [0, 9, 0, 0, 0, 4, 0, 0, 3],
//   [0, 0, 0, 0, 7, 0, 0, 3, 0],
//   [7, 0, 4, 0, 0, 2, 0, 0, 8],
//   [0, 1, 9, 0, 0, 0, 0, 0, 4],
//   [9, 0, 0, 0, 0, 0, 8, 0, 1],
//   [8, 0, 1, 7, 0, 0, 0, 0, 0],
//   [0, 7, 0, 8, 0, 0, 2, 0, 6]
// ];

//medium in book #77
// const data = [
//   [0, 0, 7, 0, 4, 5, 0, 0, 9],
//   [0, 0, 0, 0, 0, 9, 1, 0, 0],
//   [5, 0, 0, 6, 0, 0, 0, 4, 0],
//   [0, 0, 6, 0, 0, 0, 0, 9, 1],
//   [4, 0, 0, 0, 6, 0, 0, 0, 8],
//   [2, 5, 0, 0, 0, 0, 7, 0, 0],
//   [0, 7, 0, 0, 0, 4, 0, 0, 3],
//   [0, 0, 3, 5, 0, 0, 0, 0, 0],
//   [9, 0, 0, 8, 2, 0, 4, 0, 0]
// ];

// //hard in app
// const data = [
//   [0, 0, 0, 0, 8, 0, 0, 0, 5],
//   [8, 5, 1, 4, 0, 9, 0, 0, 0],
//   [4, 0, 0, 0, 2, 0, 8, 0, 0],
//   [0, 6, 8, 0, 0, 7, 9, 0, 0],
//   [0, 4, 0, 0, 0, 0, 0, 0, 7],
//   [1, 9, 0, 0, 0, 3, 2, 0, 4],
//   [0, 0, 4, 0, 0, 0, 0, 6, 0],
//   [0, 0, 0, 0, 0, 2, 0, 0, 0],
//   [0, 1, 9, 6, 7, 0, 0, 0, 0]
// ];

// very hard in app
const data = [
  [8, 0, 0, 0, 0, 1, 0, 0, 0],
  [0, 7, 0, 0, 4, 0, 0, 0, 0],
  [0, 6, 0, 0, 0, 0, 0, 1, 5],
  [0, 0, 0, 8, 0, 0, 0, 0, 2],
  [0, 0, 0, 3, 9, 4, 0, 0, 0],
  [0, 0, 0, 7, 0, 0, 6, 0, 8],
  [9, 0, 3, 0, 0, 0, 0, 8, 0],
  [0, 0, 4, 0, 0, 7, 3, 0, 0],
  [0, 0, 0, 0, 0, 0, 9, 0, 0]
];

module.exports = data;
