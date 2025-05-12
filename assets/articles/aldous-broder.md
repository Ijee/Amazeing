---
title: Aldous-Broder
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/aldous-broder.ts
  - title: Original Publication
    url: https://www.cs.cmu.edu/~15859n/RelatedWork/Broder-GenRanSpanningTrees.pdf
  - title: The Buckblog - Aldous Broder
    url: https://weblog.jamisbuck.org/2011/1/17/maze-generation-aldous-broder-algorithm
last-change: 2025-05-12
---

This algorithm created by Andrei Broder in 1989 and independently by David Aldous, creates uniform spanning trees.
While it is one of the least efficient algorithms, especially on larger graphs, it is also really simple to implement
as it is in essence just a random walk.

##### The algorithm works as follows:

> 1.  Pick a random vertex as the current vertex and mark it as visited.
> 2.  Initialize an empty set of edges for the spanning tree.
> 3.  While there are unvisited vertices:
>     * Choose a random neighbor of the current vertex.
>     * If the chosen neighbor has not been visited:
>        * Add the edge connecting the current vertex and the chosen neighbor to the spanning tree.
>        * Mark the chosen neighbor as visited.
>     * Make the chosen neighbor the current vertex and repeat.
