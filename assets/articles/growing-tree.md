---
title: Growing Tree
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/growing-tree.ts
  - title: The Buckblog - Growing Tree
    url: https://weblog.jamisbuck.org/2011/1/27/maze-generation-growing-tree-algorithm
last-change: 2025-05-12
---

This algorithm is pretty versatile in what it can achieve by changing the vertex selection strategy. It can mimic the recursive backtracker
as well as the prims algorithm with a few lines of code.

##### The algorithm works as follows:

> 1. Initialize an empty set of edges for the spanning tree.
> 2. Create a list of vertices to be processed, initially empty. Choose one arbitrarily chosen vertex from the graph, add it to the list, and mark it as visited.
> 3. While the list of vertices to be processed is not empty:
> 4. Choose a vertex as the current vertex from the list based on the specific selection strategy 
> 5. Randomly choose an unvisited neighbour of the  current vertex.
> 6. If the current vertex has an unvisited neighbour
>    * Add the edge connecting current vertex  and the unvisited neighbour the set of edges for the spanning tree.
>    * Add the unvisited neighbour to the list of vertices to be processed and mark it as visited.
> 7. If the current vertex has NO unvisited neighbours:
>    * Remove the current vertex from the list of vertices to be processed.
> 8. Repeat step 3 until the list of vertices to be processed is empty.

A selection strategy in this context can mean newest first (Recursive Backtracker), random vertex (Prims), oldest, etc.
