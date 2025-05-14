---
title: Cellular Automaton
links:
  - title: Project Implementation
    url: https://github.com/Ijee/Amazeing/blob/main/src/app/%40core/algorithm/maze/creation/cellular-automaton.ts
  - title: Wikipedia - Cellular Automaton
    url: https://en.wikipedia.org/wiki/Cellular_automaton#Maze_generation
  - title: conwaylife
    url: https://conwaylife.com/wiki/OCA:Maze
  - title: lazyslug - lifeview
    url: https://lazyslug.com/lifeview/
last-change: 2025-05-14
---

Cellular automaton can be used to create maze like structures. Most notable in that regard is  [Conways' Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) invented in 1970. With a few changes to the rules itself it can be used to create maze like structures and is entirely deterministic 
from the chosen initial state. The algorithm is fairly easy to implement 

The Mazecetric ruleset generally creates longer and straighter passages in comparison to the maze ruleset.

Make sure that the chosen ruleset applies to every cell before updating the existing grid for the next iteration or the rules
will not work as intended.

##### Mazectric Ruleset (B3/S1234)

> 1. A cell is born if it has exactly 3 live neighbours.
> 2. A living cell survives if it has 1, 2, 3, or 4 neighbours
> 3. If a cell has more than 4 neighbours it does not survive or remains dead.

##### Maze Ruleset (B3/S12345)

> 1. A cell is born if it has exactly 3 live neighbours.
> 2. A living cell survives if it has 1, 2, 3, 4 or 5 neighbours
> 3. If a cell has more than 5 neighbours it does not survive or remains dead.
