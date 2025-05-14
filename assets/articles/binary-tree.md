---
title: Binary Tree
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/binary-tree.ts
  - title: The Buckblog - Growing Tree
    url: https://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
last-change: 2025-05-12
---

This algorithm is pretty straight forward and doesn't have to keep any state at all apart from the grid/graph itself.


##### The algorithm works as follows:


> 1. Start processing the grid, typically from the top-left cell (0,0).
> 2. Process the grid row by row, and within each row process cells from left to right.
> 3. For every cell in the row, randomly choose to connect it to the cell to its left or the cell above it.


For the third step you can generally set the bias however you like (e.g. north-west which would be up and left, etc.).


