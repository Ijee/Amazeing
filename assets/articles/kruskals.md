---
title: Kruskals
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/kruskals.ts
  - title: Original Publication
    url: https://www.ams.org/journals/proc/1956-007-01/S0002-9939-1956-0078686-7/
  - title: Wikipedia - Kruskal's
    url: https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
  - title: The Buckblog - Kruskal's
    url: https://weblog.jamisbuck.org/2011/1/3/maze-generation-kruskal-s-algorithm
 
last-change: 2025-05-12
---

Similar to the Prims algorithm, Kruskal's algorithm is a greedy algorithm that finds a minimum spanning tree in a weighted undirected graph that does not form any cycles. It was first published by [Joseph Kruskal](https://en.wikipedia.org/wiki/Joseph_Kruskal) in 1956.

##### The algorithm works as follows:

> 1. Initialize a disjoint-set data structure with each vertex in its own set.
> 2. Sort all edges of the graph in ascending order by weight.
> 3. Iterate through the sorted edges:
>    * For each edge (u,v), check if u and v belong to different sets.
>    * If they are in different sets, include this edge in the solution and union the sets containing u and v.
>    * If they are in the same set, discard the edge to avoid creating a cycle.
> 4. The algorithm terminates when only one set remains, containing all vertices connected by the selected edges.

This approach efficiently builds a minimum spanning tree by always selecting the lowest-weight edge that doesn't create a cycle.