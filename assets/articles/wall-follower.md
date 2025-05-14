---
title:  Wall Follower
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/maze-specific/wall-follower.ts
  - title: Wikipedia - Wall Follower
    url: https://en.wikipedia.org/wiki/Maze-solving_algorithm#Hand_On_Wall_Rule
last-change: 2025-05-14
---

This is a common way to solve mazes that are simply connected which means that all its walls are connected to each other
and by keeping one hand on one side of the wall will guarantee to eventually reach the goal/exit if there is one but may take a while
depending on the maze.

If the maze is not simply connected one could find themselves trapped and walking in a loop that is disconnected to other parts
of the maze with no means to escape and thus this method is not guaranteed to succeed.  
