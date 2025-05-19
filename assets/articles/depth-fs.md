---
title:  Depth-First Search
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/depth-first-search.ts
  - title: Wikipedia - Depth-First Search
    url: https://en.wikipedia.org/wiki/Depth-first_search
last-change: 2025-05-19
---

Depth-first search is very similar to the breadth-first search algorithm and also one of the most common approaches to traverse trees or graphs. It explores as deeply as possible along each branch of the input graph but may not terminate in time if a branch or subset of the graph is too large or infinite. See [Iterative deepening depth-first search](https://en.wikipedia.org/wiki/Iterative_deepening_depth-first_search).

This algorithm is a specific form of the [backtracking algorithm](http://www.amazeing.app/learn?algorithm=Recursive-Backtracking) algorithm which is a more general purpose algorithm that also prunes during its runtime. 

[This](https://stackoverflow.com/questions/1294720/whats-the-difference-between-backtracking-and-depth-first-search) stackoverflow question has more information in regards to this question.

##### The algorithm works as follows:

> 1. Initialisation
>    * Initialise a stack.
>    * Choose a starting vertex from the input graph, push it on the stack and mark the vertex as visited.
> 2. While the stack is not empty:
>    * Pop a vertex from the stack.
>    * If the vertex is the goal:
>         * terminate / backtrack by checking the predecessors from the goal vertex to get the full path found.
>    * For all neighbors of the current vertex connected by edges do:
>        * If the neighbour vertex is not marked as visited:
>             * Mark the vertex as visited.
>             * Set the predecessor of the neighbour to be the current vertex.
>             * push the neighbour vertex on the stack.

By simply changing out the stack functionality to be a queue you get the Breadth-First Search algorithm.