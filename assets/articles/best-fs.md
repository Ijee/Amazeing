---
title:  Best-First Search
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/best-first-search.ts
  - title: Wikipedia - Best-First Search
    url: https://en.wikipedia.org/wiki/Best-first_search
last-change: 2025-05-14
---

This algorithm always expands the node that appears the most promising based on its [heuristic distance](https://en.wikipedia.org/wiki/Admissible_heuristic). While there are various methods to calculate the heuristic value the principle stays the same and the vertex with
the lowest calculated value should be chosen when properly enqueued in a priority queue or other applicable data structures.

This algorithm is usually implemented using a [priority queue](https://en.wikipedia.org/wiki/Priority_queue).

##### The algorithm works as follows:

> 1. Initialisation
>    * Initialise a priority queue.
>    * Choose a starting vertex from the input graph, enqueue it and mark the vertex as visited.
> 2. While the queue is not empty:
>    * Dequeue a vertex from the queue with min priority value to the goal.
>    * If the vertex is the goal:
>         * terminate / backtrack by checking the predecessors from the goal vertex to get the full path found.
>    * For all neighbors of the current vertex connected by edges do:
>        * If the neighbour vertex is not marked as visited:
>             * Mark the vertex as visited.
>             * Calculate the neighbours heuristic value.
>             * Set the predecessor of the neighbour to be the dequeued vertex.
>             * Enqueue the neighbour vertex with its heuristic value as its priority.