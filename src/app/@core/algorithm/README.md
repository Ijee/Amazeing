## Algorithms

All algorithms are based on two abstract classes (one for maze and one for the pathfinding mode)
that define how the algorithms should handle all their data between the algorithm service and should
at the same time be the only way to get the data out of them for the next iteration.

# Node Colours

There are a few pre-defined colours available to use for the grid representation.

You can find them in the /styles/colors.scss file and there is some consistency what the colours or rather node-status represent:

0. an empty node that hasn't been touched or painted over
1. a wall / obstacle
2. the start node
3. the goal node
4. general node tracking
5. node that has already been built on for the maze mode and already explored node for the pathfinding mode
6. tbd
7. general node tracking
8. the cursor / current position of the algorithm or (fastest) path for the pathfinding mode
9. to track something without it needing to be visible / already touched node

The order of those node-status colours have no meaning and just happened to be like this
because I am really good in planning ahead.

# Node Weights

Node weights are generally in the 0 - 9 range and only
some algorithm go higher than 9 because it makes it
not very readable on certain devices.

Also: avoid negative node weights because they are reserved and most if not every algorithm won't be able to handle them anyway.
