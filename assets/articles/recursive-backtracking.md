---
title: Recursive Backtracking
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/recursive-backtracking.ts
  - title: The Buckblog - Backtracking
    url: https://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking
  - title: Wikipedia - Backtracking
    url: https://en.wikipedia.org/wiki/Backtracking
 
last-change: 2025-05-12
---

The Recursive Backtracking algorithm is one of the most common and intuitive methods for generating mazes. It is based on the concept of Depth-First Search (DFS) and performs a random walk but only towards vertices that have not been visited yet which effectively builds a spanning tree.

##### The algorithm works as follows:

> 1. Choose an arbitrary vertex and mark it as visited.
> 2. While the current cell has any unvisited neighbours:
>    * Choose one of the unvisited neighbours randomly.
>    * Set the neighbour vertex as the current one and mark it as visited.
> 3. If the current vertex has no unvisited neighbours backtrack to the previous cell in the path and continue from there.

To track the current path a simple queue is sufficient.

The algorithm generally creates mazes with long winding passages.