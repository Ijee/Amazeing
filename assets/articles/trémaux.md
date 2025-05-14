---
title: Trémaux
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/maze-specific/tremaux.ts
  - title: Wikipedia - Wall Follower
    url: https://en.wikipedia.org/wiki/Maze-solving_algorithm#Tr%C3%A9maux's_algorithm
last-change: 2025-05-14
---

This is a method in which you count by drawing or leaving objects at the entrances of each passage in a junction but is not 
guaranted to find the shortest route but helps by removing loops from the maze. An entrance of a passage is either unvisited, 
marked once or marked twice. 

##### The algorithm works as follows:

> 1. If the path ends in a dead-end go back to the last junction and mark the entrance with two marks.
> 2. Always mark the passage from where you cam from when entering or leaving a passage.
>    * Never enter a passage that already has two marks.
> 3. If you arrive at a junction that you have not been to before: 
>    * Choose an arbitrary passage among those with zero marks and follow it.
> 4. If you arrive at a junction that you have been to before:
>    * If there are any passages leading away with zero marks choose one of those arbitrarily.
>    * If there are no passages leading away with zero marks but there are passages with one mark
>      choose one of those.
>    * If all passages leading away from the junction (except the one you came from) have two marks
>      you have to go back because you explored this junction fully.

When you reach the exit/goal the path can be traced back by following only the passages that have a single mark.

**Note**: this algorithm is currently disabled because I still have no way to show any other symbols than simple numbers or text on a node.
You can find the issue [here](https://github.com/Ijee/Amazeing/issues/2) if you want to help fix this.