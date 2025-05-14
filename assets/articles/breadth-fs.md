---
title:  Breadth-First Search
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/breadth-first-search.ts
  - title: Wikipedia - Breadth-First Search
    url: https://en.wikipedia.org/wiki/Breadth-first_search
last-change: 2025-05-14
---

Breadth-first search is one of the most common approaches to traverse graphs that explores all nodes at the current depth
before moving on to the vertices at the next level. This algorithm is guaranteed to find a solution if it exists but may not be
the fastest depending on the input graph.

##### The algorithm works as follows:

> 1. Initialisation
>    * Initialise a queue.
>    * Choose a starting vertex from the input graph, enqueue it and mark the vertex as visited.
> 2. While the queue is not empty:
>    * Dequeue a vertex from the queue.
>    * If the vertex is the goal:
>         * terminate / backtrack by checking the predecessors from the goal vertex to get the full path found.
>    * For all neighbors of the current vertex connected by edges do:
>        * If the neighbour vertex is not marked as visited:
>             * Mark the vertex as visited.
>             * Set the predecessor of the neighbour to be the dequeued vertex.
>             * Enqueue the neighbour vertex.

By simply changing out the queue functionality to be a stack you get the Depth-First Search algorithm.