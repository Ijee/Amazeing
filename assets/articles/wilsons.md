---
title: Wilsons
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/wilsons.ts
  - title: Wikipedia - Wilsons
    url: https://en.wikipedia.org/wiki/Loop-erased_random_walk#Uniform_spanning_tree
  - title: The Buckblog - Wilsons
    url: https://weblog.jamisbuck.org/2011/1/20/maze-generation-wilson-s-algorithm
last-change: 2025-05-12
---
Wilson's algorithm prodcues a uniform spanning tree. While the Aldous-Broder algorithm uses a single random walk, Willson's algorithm builds the tree incrementally using a sequence of loop-erased random walks. This makes it generally more efficient than Aldous-Broder, particularly on larger graphs.

##### The algorithm works as follows:

> 1. Start with a spanning tree containing a single, arbitrarily chosen vertex.
> 2. While there are vertices not yet included in the spanning tree:
>    * Choose an arbitrary vertex that is not currently in the spanning tree.
>    * Perform a random walk starting from this chosen vertex.
>    * During the random walk any loops created by revisiting a vertex already on the \
>      current path of this walk are immediately erased. Once removed restart the random walk from the node that completed a cycle.
>      This process results in a Loop-Erased Random Walk.
>    * Continue this loop-erased random walk until it hits a vertex that is already part of the growing spanning tree and
>    * add the path taken to the existing spanning tree.
> 3. Repeat step 2 until all vertices in the graph are included in the spanning tree.

There are multiple options in how you choose the next starting point for the random walk and in this app there
are two options available ('choose random node' and 'sequential node selection). It doesn't change the uniformity of the resulting
tree but may change the look of it by having more or less straight passages.

My implementation of this algorithm always searches for the start node to complete the first random walk as it
ensures an intitial path for the pathfinding algorithms for later.