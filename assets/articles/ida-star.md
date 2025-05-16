---
title: IDA*
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/ida-star.ts
  - title: Wikipedia - IDA*
    url: https://en.wikipedia.org/wiki/Iterative_deepening_A*
last-change: 2025-05-19
---

The Iterative Deepening A* algorithm that combines the principles of the A* algorithm where each search performs a depth-limited search
that is limited by a threshold of f(n) = g(n) + h(n). Just like A*, this algorithm is guaranteed to find the shortest path from start to goal if the heuristic being used is  [consistent](https://en.wikipedia.org/wiki/Consistent_heuristic) and [admissible](https://en.wikipedia.org/wiki/Admissible_heuristic). It basically trades time for space efficiency by re-exploring paths in each iteration.


##### The algorithm works as follows:

**g(n):** The actual cost of the current cheapest path from the start node to the current node.

**h(n):** The estimated cost calculated by the chosen heuristic from the current node to the goal node.

**f(n):** The estimated total cost from the start node to the goal node. Calculated by f(n) = g(n) + h(n);

**Threshold:** The maximum f(n) value allowed for nodes to be expanded in the current iteration.


> 1. Initialise:
>      * Set g(start node) = 0 and calculate \
>        f(start node) = g(start node) + h(start node) to set it as the initial threshold.
>      * Initialise a way to track the to store the current path (e.g. empty list).
> 2. While a solution has not been found:
>    * Set next threshold to ∞ (infinity).
>    * Perform a Depth First Search (DFS) from the start node with the current threshold as the
>      maximum allowed f(n) value for this iteration and pass g(start node), f(start node) and current threshold as the maximum allowed:
>        * Maintain the current path to the node being explored.
>        * Calculate f(current node)
>        * If f(current node) exceeds the current threshold:
>            * Do not explore this path further.
>            * Update next threshold to min(next threshold, f(current node)).
>        * If the current node is the goal node
>            * Terminate and return the current path.
>        * For all neighhbours of the current node:
>            * Recursively call the DFS function on the neighbour passing g(neighbour) and the updated current path.
>        * After all searches return:
>            * Terminate If the next threshold is still ∞ (infinity) it means the entire search space was explored
>              within the last threshold and no solution exists.
>            * Otherwise set the threshold for the next iteration to next threshold.

If you select the 'Diagonal movement' or even 'Cross corners' options in this app you may freeze the tab due to adding a substantial
amount of additional paths being available in each iteration. It works pretty well in mazes that are limited in the paths that are available
but may struggle in open spaces with lots of options available.