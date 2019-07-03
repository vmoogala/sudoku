sudoku

#Goals

- Write a quick & dirty solution first in JS
- Rewrite in java using efficient Data Structures and Threads
- Improve the code

- Feature1
  If a grid has a possibility of a number on the same row or column, check for that number in adjacent grids/rows and columns

- Feature2
  In a row or column, take the remaining numbers to fill and check for corresponding columns/grids for exclusions
  Ex: If a row has 3, 4 and 5 to be filled in 3 spaces. Check for 3,4,5 in columns/grids pertaining to that empty spaces. If suppose a column has 3 and 4 in it, fill 5 in the space in row

- Feature3
  If a column has all the remaining numbers to be filled in a same grid, find for other numbers in the grid excluding the numbers to be filled in that column in the grid.
