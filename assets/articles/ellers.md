---
title: Ellers
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/ellers.ts
  - title: The Buckblog - Ellers
    url: https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm
  - title: astrolog.org - algorihms
    url: https://www.astrolog.org/labyrnth/algrithm.htm#:~:text=Eller%27s%20algorithm%3A,prevent%20texture%20blemishes.
 
last-change: 2025-05-12
---

Eller's algorithm is a method for generating mazes that is particularly notable for its ability to create a maze row by row, making it very memory efficient especially for large grids. It guarantees the generation of a "perfect" maze" which is equivalent to a spanning tree of the grid graph although the reuslting mazes are biased in comparison to other true random algorithms.

The algorithm works by maintaining sets of connected cells in the current row and deciding whether to create horizontal or vertical connections based on these sets.

##### About the origin of this algorithm:

I tried to look up more information about this algorithm but I had no luck until I found this comment from [the buckblog](https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm#:~:text=I%20asked%20the,algorithm%20after%20him.%E2%80%9D):

> I asked the maintainer of “Think Labyrinth” about the origin of Eller’s algorithm and here was his response:
>    * “Eller’s algorithm is named after computer programmer Marlin Eller, CEO of sunhawk.com. He invented this algorithm in 1982, which is the earliest use of it I know of. He never published it, but he did tell me about it, so I chose to name the algorithm after him.”

*I can not confirm this whatsoever so please take this with a grain of salt but it is the only thing I ever found about it.*

##### The algorithm works as follows:

> 1. Each cell in the first row is placed into its own unique set.
> 2. For each cell in the current row, moving from left to right:
>    * Consider the wall to the right of the current cell. Randomly decide whether to remove this wall.
>        * If the wall is removed:\
>          The set of the current cell and the set of the cell to its right are merged into a single set.
>    * Consider the wall below the current cell. Randomly decide whether to remove this wall.
>       * If the wall is removed:\
>         This connects the current cell to a cell in the next row. However, to ensure a perfect maze, there must be at least one
>         passage leading down from each set in the current row.
> 3. Based on the vertical connections made, initialize the sets for the next row. If a cell in the current row 
>    had its bottom wall removed, the corresponding cell in the next row inherits its set. Cells in the next row not connected from the >    current row start in their own unique sets.
> 4. Continue processing each subsequent row (steps 2 and 3) until the last row is reached.
> 5. At the last row remove all walls between adjacent cells that are in different sets. This ensures that all remaining unconnected sets  are joined thus completing the spanning tree. No vertical walls are created from the last row.

The implementation of this app differs a bit in comparison to this description. I currently do the horizontal passages first
and only then decide on the vertical passages by going through the row again which basically does the same thing but doubles
the amount of iterations needed.

I am not sure why I did it like this but I hope to change this behaviour in the future.
 
The [issue](https://github.com/Ijee/Amazeing/issues/9) can be found here if you want to help.