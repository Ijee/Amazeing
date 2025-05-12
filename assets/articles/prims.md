---
title: Prims
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/prims.ts
  - title: Wikipedia - Prims
    url: https://en.wikipedia.org/wiki/Prim%27s_algorithm
  - title: The Buckblog - Prims
    url: https://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
last-change: 2025-05-12
---

The Prims algorithm is a greedy algorithm to create a minimum spanning tree for  weighted undirected graphs. It aims to find the set of edges that connects all the vertices in the graph with the minimum possible total edge weight without forming any cycles.

It was initially developed by [Vojtěch Jarník](https://en.wikipedia.org/wiki/Vojt%C4%9Bch_Jarn%C3%ADk) in 1930 and later rediscovered by Robert C. Prim in  1957 and Edsger W. Dijkstra in 1959.

##### The algorithm works as follows:

> 1. Choose any arbitrary vertex from the graph to start. Add this vertex to the set of vertices included in your growing minimum spanning tree.
> 2. Then choose the edge with the smallest weight from the graph that connects \
> a vertex that is in the set to one that isn't in the set.
> 3. Add the edge to the minimal spanning tree and the new vertex to the set.\
> (If multiple edges have the same minimum weight, any one of them can be chosen).
> 4. Continue steps 2 and 3 until all vertices from the original graph have been added to the minimum spanning tree.

