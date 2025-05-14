---
title:  Dead-End Filling
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/maze-specific/dead-end-filling.ts
  - title: Wikipedia - Dead-end filling
    url: https://en.wikipedia.org/wiki/Maze-solving_algorithm#Dead-end_filling
last-change: 2025-05-14
---

This method is rather simple and will help you find multiple ways to from the start to the goal but can only
be used to solve mazes on paper or computer if you know the full shape of the maze.

##### It works as follows:

> 1. Find all dead-ends in the maze and mark them.
> 2. Fill in the path from each dead-end until the first junction is met.

You will have to revisit some passages once other dead ends are filled in.