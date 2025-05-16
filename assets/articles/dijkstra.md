---
title: Dijkstra
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/dijkstra.ts
  - title: Wikipedia - Dijkstra
    url: https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm
last-change: 2025-05-18
---

Dijkstra is a greedy search algorithm for finding the shortest paths from the starting vertex to every other vertex in a weighted graph.
Negative value edges are not allowed.

##### The algorithm works as follows:

> 1. Create a set of all unvisited vertices.
> 2. Assign a distance value to every vertex which is ∞ (infinity) and 0 for the starting vertex in the set.
> 3. Select the smallest finite distance from the unvisited set.
>    * For the first iteration that is going to be the startig vertex.
>    * Termiante the algorithm when the unvisited set is empty or contains only nodes with infinite distance.
> 4. For the current vertex consider updating the neighbours distance values:
>    * Compare the newly calculated distance to the current one and assign the smaller one.
>    * If a new assignment has been made also assign the current vertex as the new predecessor of that neighbour.
>      After processing every neighbour remove that vertex remove the current node from the unvisited set. That guarantees that every    >      vertex only gets checked once.
> 5. Once all nodes have been processed (Step 3+) each node in the visited set has a predecessor that can be used to get the shortest
>    distance from the starting vertex.


In this app the algorithm terminates once it finds the goal and also uses a [priority queue](https://en.wikipedia.org/wiki/Priority_queue).