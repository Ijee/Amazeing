---
title:  Pledge
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/path-finding/maze-specific/pledge.ts
  - title: Wikipedia - Pledge
    url: https://en.wikipedia.org/wiki/Maze-solving_algorithm#Pledge_algorithm
last-change: 2025-05-14
---

This is a modification of the wall-follower method designed to circumvent obstacles where some walls are not necessarily 
connected to the outer walls of the maze. Before you start you select a direction in which to go towards. When you 
find a wall you keep your hands on the wall depending on which hand you initially choose.

 Just like the wall follower method you should not change hands. Follow it while counting the turns by having a clockwise turn be positive (e.g. 90°) and a counter clockwise turn is negative (e.g. -90°). 
 
 When the sum of the of the turns you made come back to 0° and face your original chosen direction you leave the walls/obstacles again and go in your original direction until you find another wall or hopefuly the exit.

**Note**: The implementation of this method always assumes the initial direction to be east/right. I may update it in the future so that the user can choose the initial direction themselves.