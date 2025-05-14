---
title: Recursive Division
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/recursive-division.ts
  - title: Wikipedia - Recursive Division
    url: https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
  - title: The Buckblog - Recursive Division
    url: https://weblog.jamisbuck.org/2011/1/12/maze-generation-recursive-division-algorithm

last-change: 2025-05-14
---

This algorithm breaks down the grid into smaller subsets that get processed one after another.
It often results in long corridors with a low number of dead ends compared to other algorithms to create mazes.

##### The algorithm works as follows:

> 1. Start with an empty grid.
> 2. Divide the grid either horizontally or vertically at a random position and build a wall that divides
>    the grid into two sub-sections.
> 3. Create a passage along the newly created wall to ensure connectivity within the maze.
> 4. Now divide the next sub-section like in step 2
> 5. Continue until the maze reaches the desired resolution.

The implementation in this app breaks it down to single cell corridors encased by walls around it.

You could also track the depth of the current division to create small room like structures that is encased
by a maze like structure. This could be helpful when you play around with procedural generation in video games.