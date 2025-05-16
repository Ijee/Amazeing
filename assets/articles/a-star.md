---
title: A*
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/a-star.ts
  - title: Wikipedia - A*   
    url: https://en.wikipedia.org/wiki/A*_search_algorithm
last-change: 2025-05-18
---

This is an efficient and widely used pathfinding algorithm that is considered an [informed search algorithm](https://en.wikipedia.org/wiki/Search_algorithm#Informed_search) that uses a heuristic to prioritize vertices that are more likely to succeed. It can be considered an extension to the Dijkstra algorithm. A* is guaranteed to find the shortest path from start to goal if the heuristic being used is [consistent](https://en.wikipedia.org/wiki/Consistent_heuristic) and [admissible](https://en.wikipedia.org/wiki/Admissible_heuristic).

##### The algorithm works as follows:

**g(n):** The actual cost of the current cheapest path from the start node to the current node.

**h(n):** The estimated cost calculated by the chosen heuristic from the current node to the goal node.

**f(n):** The estimated total cost from the start node to the goal node. Calculated by f(n) = g(n) + h(n);

> 1. Create an open set and add the starting node to it with itself as its predecessor and a closed set for
>    visited nodes which is initially empty.
> 2. Assign a distance value to every node which is ∞ (infinity) and 0 for the starting node in the open set.
> 3. While the open set is not empty:
>    * Select the current node from the open set that has the lowest f(n) value and remove it from the open set.
>    * Add current node to the closed set.
>    * Terminate if the current node is the goal node.
>    * For all neighbours of the current node:
>        * If the neighbour node is already found in the closed set, skip it as its shortest path has already been finalized.
>        * Calculate the tentative g score which is g(current node) + the weight of the edge to the neighbour.
>        * If the tentative g score is less than the neighbour's current g(neighbour):
>            * Set the newly calculated tentative g score on the neighbour node.
>            * Calculate f(neighbour) = g(neighbour) + h(neighbour).
>            * Set the predecessor of the neighbour to the current node.
>            * If the neighbour is not already in the open set, add it to the open_set with its f(neighbour) as its priority.
>            * If the neighbour is already in the open set, update its priority in the open set to its new f(neighbour) value.

A* in this app uses a [priority queue](https://en.wikipedia.org/wiki/Priority_queue).