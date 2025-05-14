---
title: Hunt and Kill
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/hunt-and-kill.ts
  - title: The Buckblog - Hunt and Kill
    url: https://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm
  - title: astrolog.org - algorihms
    url: https://www.astrolog.org/labyrnth/algrithm.htm#:~:text=Hunt%20and%20kill%20algorithm%3A,issues%20the%20recursive%20backtracker%20has.
last-change: 2025-05-12
---

The hunt and Kill algorithm has two disctint phases to create a spanning tree or maze. It is similar to the recursive
backtracking algorithm in that it performs a random walk until is has no unvisited neighbours left.

##### The algorithm works as follows:

> 1. Choose an arbitrary vertex and mark it as visited.
> 2. Walking Phase:
>    * While the current cell has any unvisited neighbours:
>        * Choose one of the unvisited neighbours randomly.
>        * Set the neighbour vertex as the current one and mark it as visited.
>        *  If the current vertex has no unvisited neighbours  >           left stop the walking phase.
> 3. Hunt Phase: 
>    * Scan the grid until you find a vertex that has not been >      visited yet and is adjacent to a visited vertex.
>    * Connect the newly found vertex and adjacent neighbour and
>      set the new vertex as the current one to restart the >      walking phase.
> 4. Repeat Steps 2 and 3 until no unvisited vertices remain.