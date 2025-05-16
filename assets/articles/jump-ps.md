---
title: Jump Point Search
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/jump-poin-search.ts
  - title: Original Publication
    url: https://users.cecs.anu.edu.au/~dharabor/data/papers/harabor-grastien-aaai11.pdf
  - title: Wikipedia - Jump Point Search
    url: https://en.wikipedia.org/wiki/Jump_point_search
  - title: zerowidth
    url: https://zerowidth.com/2013/a-visual-explanation-of-jump-point-search/
last-change: 2025-05-19
---

Jump point search is an optimised pathfinding algorithm based on the A* search for uniform cost grid maps and runs significantly faster than A*. During its execution it prunes exploration paths by making certain assumptions about the current node's neighbours.

##### The algorithm works as follows:

**g(n):** The actual cost of the current cheapest path from the start node to the current node n.

**h(n):** The estimated cost calculated by the chosen heuristic from the current node n to 
the goal node.

**f(n):** The estimated total cost from the start node to the goal node through node n. Calculated by `f(n)=g(n)+h(n)`;

**Jump Point:** A node identified by the JPS algorithm that needs to be explicitly considered as a successor. These include the goal node itself, nodes with "forced neighbours" (explained below), or nodes from which you can reach another jump point via a straight line.

**\* Forced Neighbours:** A neighbour node that, if not considered, would mean missing a potentially optimal path due to an obstacle. JPS must "force" consideration of these nodes to maintain optimality.


> 1. Initialize
>    * Create an open set *(e.g. a priority queue)* and a closed set for visited nodes, 
>      both initially empty.
>    * Assign a distance value to every node which is ∞ (infinity) and 0 for the starting >      node in the open set.
>    * Calculate `f(start node) = g(start node) + h(start node)`
>    * Add the start node to the open set with its f(start node) value as its priority.
>    * Initialize a map or array to store the predecessor of each node
>      for path reconstruction.
> 2. While open set is not empty:
>    * Select the current node from the open set that has the lowest f(n) value
>      and remove it from the open set.
>    * Add the current node to the closed set.
>    * If the current node is the goal node:
>        * Terminate and return the shortest path found using the
>          predecessor information we saved.
>    * Identify Jump Point sucessors:
>        * Pruning: Eliminating unnecessary search directions based on
>          symmetry *(e.g., if you came from the left and can move freely
>          straight up, you don't need to explicitly check the top-left or 
>          top-right neighbours unless they are "forced")*.
>        * For each remaining valid direction from the current node
>          call the Jump function recursively.
>            * It moves in one direction one node at a time.
>            * It returns if:
>                * The node is the goal.
>                * The node has forced neighbours\*.
>                * The node allows a straight line to reach another
>                  jump point (e.g., by hitting an obstacle that causes
>                  a forced neighbour).
>        * For each returned jump point by the Jump function:
>            * Skip the node if it is in the closed set already.
>            * Calculate the tentative g score for the jump point successor:\
>              `g(current node) + cummulative edge cost to the jump point successor.`
>            * If the tentative g score is less than the jump point successor
>              g(jump point succesor):
>                * Update successor's g(jump point successor) g score 
>            * Calculate `f(jump point sucessor) = g(jump point successor) +
>              h(jump point successor)`
>            * Set the predecessor of the jump point successor to the current node.
>            * Add the jump point succeessor to the open set with its \
>              `f(jump point successor)` as its priority.
>            * If the jump point successor is already in the open set update its
>              priority to the new `f(jump point successor)` value.


I recommend this [website](https://zerowidth.com/2013/a-visual-explanation-of-jump-point-search/#expanding-intelligently), especially for the visual explanation of the pruning rules.