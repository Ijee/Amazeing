---
title: Sidewinder
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/sidewinder.ts
  - title: The Buckblog - Sidewinder
    url: https://weblog.jamisbuck.org/2011/2/3/maze-generation-sidewinder-algorithm
  - title: astrolog.org - algorihms
    url: https://www.astrolog.org/labyrnth/algrithm.htm#:~:text=Sidewinder%20Mazes%3A,next%20to%20it.
 
last-change: 2025-05-12
---

The Sidewinder algorithm is a maze generation technique that is very similar to the binary tree algorithm. It works by processing the grid one row at a time but has only one side being spanned by a passage. It's known for being relatively simple to implement and for producing mazes with a distinct directional bias. Typically horizontal if processed row by row.

##### The algorithm works as follows:

> 1. Start at the cell at [0,0] and initialize the run set to be empty.
> 2. Add the current cell to the run set.
> 3. Randomly decide for the current cell whether to carve east or not.
> 4. If a passage was carved add the new cell to the run set and repeat from step 2.
> 5. If a passage was not carved choose any cell in the run set and carve north from one of it.
>    Clear the run set and and set the next cell as the current cell and go back to step 2.
> 6. Terminate once all rows have been processed.