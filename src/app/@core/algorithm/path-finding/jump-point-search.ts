import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm, VisitedNode } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { PriorityQueue } from 'src/app/@shared/classes/PriorityQueue';
import { HashMap } from 'src/app/@shared/classes/HasMap';

export class JumpPointSearch extends PathFindingAlgorithmAbstract {
    private priorityQueue: PriorityQueue;
    private visitedNodes: HashMap<GridLocation, VisitedNode>;
    private currentPath: GridLocation[];
    private tracePath: GridLocation;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Queued',
                    type: 'status-4'
                },
                {
                    name: 'Jump Points',
                    type: 'status-5',
                    currentValue: 0
                },
                {
                    name: 'Fastest Path',
                    type: 'status-8'
                },
                {
                    name: 'Scanned',
                    type: 'status-7'
                }
            ],
            {
                controls: []
            }
        );
        this.priorityQueue = new PriorityQueue();
        this.visitedNodes = new HashMap<GridLocation, VisitedNode>();
        this.currentPath = [];
    }

    /** Checks grid bounds and if the node is not a wall.
     *
     * @param x the x coordinate
     * @param y the y coordinate
     * @returns whether it is walkable
     */
    private isWalkableAt(x: number, y: number): boolean {
        return (
            x >= 0 &&
            x < this.grid.length &&
            y >= 0 &&
            y < this.grid[0].length &&
            this.grid[x][y].status !== 1
        );
    }

    /**
     * Calculates the actual movement cost between two points for g-cost accumulation.
     * Assumes uniform grid cost (1 straight, sqrt(2) diagonal) as base.
     * Node weights are added separately when calculating total tentative g-cost.
     */
    private getMovementCost(nodeA: GridLocation, nodeB: GridLocation): number {
        const dx = Math.abs(nodeA.x - nodeB.x);
        const dy = Math.abs(nodeA.y - nodeB.y);
        // Using standard costs.
        const COST_DIAGONAL = Math.SQRT2;
        const COST_STRAIGHT = 1;

        // Calculate steps
        const diagonalSteps = Math.min(dx, dy);
        const straightSteps = Math.max(dx, dy) - diagonalSteps;

        return diagonalSteps * COST_DIAGONAL + straightSteps * COST_STRAIGHT;
    }

    /**
     * Gets neighbours relevant for JPS exploration based on parent direction.
     * Returns GridLocation objects for potential jump starting points.
     */
    private getPrunedNeighbours(
        currentNode: GridLocation,
        parent: GridLocation | undefined
    ): GridLocation[] {
        // If no parent (start node), explore all walkable neighbours initially
        if (!parent || currentNode.equals(parent)) {
            // Use your existing getNeighbours, but filter out walls
            return this.getNeighbours(currentNode, 1).filter((n) => this.isWalkableAt(n.x, n.y));
        }

        const neighbours: GridLocation[] = [];
        const px = parent.x;
        const py = parent.y;
        const cx = currentNode.x;
        const cy = currentNode.y;

        const dx = Math.sign(cx - px); // Direction travelled horizontally
        const dy = Math.sign(cy - py); // Direction travelled vertically

        // Helper to get a GridLocation object IF walkable, otherwise null
        const getLocationIfWalkable = (x: number, y: number): GridLocation | null => {
            if (this.isWalkableAt(x, y)) {
                const nodeInfo = this.grid[x][y];
                // Create new GridLocation instance from grid data
                return new GridLocation(x, y, nodeInfo.weight, nodeInfo.status);
            }
            return null;
        };

        if (dx !== 0 && dy !== 0) {
            // Came Diagonally
            let neighbour: GridLocation | null;
            // 1. Check Straight Horizontal continuation
            if ((neighbour = getLocationIfWalkable(cx + dx, cy))) neighbours.push(neighbour);
            // 2. Check Straight Vertical continuation
            if ((neighbour = getLocationIfWalkable(cx, cy + dy))) neighbours.push(neighbour);
            // 3. Check Diagonal continuation (only if straight paths clear)
            if (this.isWalkableAt(cx + dx, cy) || this.isWalkableAt(cx, cy + dy)) {
                if ((neighbour = getLocationIfWalkable(cx + dx, cy + dy)))
                    neighbours.push(neighbour);
            }

            // 4. Check Forced Neighbours (from corners relative to arrival)
            if (!this.isWalkableAt(cx - dx, cy)) {
                // If blocked horizontally backward
                if ((neighbour = getLocationIfWalkable(cx - dx, cy + dy)))
                    neighbours.push(neighbour); // Check corner
            }
            if (!this.isWalkableAt(cx, cy - dy)) {
                // If blocked vertically backward
                if ((neighbour = getLocationIfWalkable(cx + dx, cy - dy)))
                    neighbours.push(neighbour); // Check corner
            }
        } else {
            // Came Straight (Horizontally or Vertically)
            let neighbour: GridLocation | null;
            if (dx !== 0) {
                // Came Horizontally (dx is +/- 1, dy is 0)
                // 1. Check Straight continuation
                if ((neighbour = getLocationIfWalkable(cx + dx, cy))) {
                    neighbours.push(neighbour);
                    // Forced neighbours only apply if straight path is clear
                    // 2. Check Forced Up
                    if (!this.isWalkableAt(cx, cy + 1)) {
                        // Blocked above
                        if ((neighbour = getLocationIfWalkable(cx + dx, cy + 1)))
                            neighbours.push(neighbour);
                    }
                    // 3. Check Forced Down
                    if (!this.isWalkableAt(cx, cy - 1)) {
                        // Blocked below
                        if ((neighbour = getLocationIfWalkable(cx + dx, cy - 1)))
                            neighbours.push(neighbour);
                    }
                }
            } else {
                // Came Vertically (dx is 0, dy is +/- 1)
                // 1. Check Straight continuation
                if ((neighbour = getLocationIfWalkable(cx, cy + dy))) {
                    neighbours.push(neighbour);
                    // Forced neighbours only apply if straight path is clear
                    // 2. Check Forced Right
                    if (!this.isWalkableAt(cx + 1, cy)) {
                        // Blocked right
                        if ((neighbour = getLocationIfWalkable(cx + 1, cy + dy)))
                            neighbours.push(neighbour);
                    }
                    // 3. Check Forced Left
                    if (!this.isWalkableAt(cx - 1, cy)) {
                        // Blocked left
                        if ((neighbour = getLocationIfWalkable(cx - 1, cy + dy)))
                            neighbours.push(neighbour);
                    }
                }
            }
        }
        return neighbours;
    }

    /**
     * Recursively searches in a direction for the next jump point.
     * @param cx Current X coordinate being evaluated
     * @param cy Current Y coordinate being evaluated
     * @param px Parent X (the node *from* which we are jumping *towards* cx, cy)
     * @param py Parent Y
     * @returns Coordinates {x, y} of the jump point, or null if no jump point found.
     */
    private jump(cx: number, cy: number, px: number, py: number): { x: number; y: number } | null {
        const dx = cx - px; // Direction of jump dx
        const dy = cy - py; // Direction of jump dy

        // 1. Boundary and Obstacle Check
        if (!this.isWalkableAt(cx, cy)) {
            return null; // Hit wall or boundary
        }

        // Optional: Visualize the jump scan path
        if (
            !(
                this.grid[cx][cy].status === 2 ||
                this.grid[cx][cy].status === 3 ||
                this.grid[cx][cy].status === 6
            )
        ) {
            this.paintNode(cx, cy, 7);
        }

        // 2. Goal Check
        if (this.grid[cx][cy].status === 3) {
            return { x: cx, y: cy };
        }

        // 3. Forced Neighbour Check
        if (dx !== 0 && dy !== 0) {
            // Diagonal Jump Check
            // Check for forced neighbours horizontally/vertically relative to the diagonal direction
            // Forced if the cell adjacent (but off the diagonal path) is blocked, but the corner cell is open
            if (
                (this.isWalkableAt(cx - dx, cy + dy) && !this.isWalkableAt(cx - dx, cy)) ||
                (this.isWalkableAt(cx + dx, cy - dy) && !this.isWalkableAt(cx, cy - dy))
            ) {
                return { x: cx, y: cy };
            }
            // Additionally, for diagonal moves, check if continuing straight horizontally or vertically from current leads to a jump point.
            // This catches jump points along walls earlier.
            if (
                this.jump(cx + dx, cy, cx, cy) !== null ||
                this.jump(cx, cy + dy, cx, cy) !== null
            ) {
                return { x: cx, y: cy };
            }
        } else {
            // Straight Jump Check (Horizontal or Vertical)
            if (dx !== 0) {
                // Horizontal Jump
                // Check forced neighbours above/below
                if (
                    (this.isWalkableAt(cx + dx, cy + 1) && !this.isWalkableAt(cx, cy + 1)) ||
                    (this.isWalkableAt(cx + dx, cy - 1) && !this.isWalkableAt(cx, cy - 1))
                ) {
                    return { x: cx, y: cy }; // Forced neighbour found
                }
            } else {
                // Vertical Jump (dy !== 0)
                // Check forced neighbours left/right
                if (
                    (this.isWalkableAt(cx + 1, cy + dy) && !this.isWalkableAt(cx + 1, cy)) ||
                    (this.isWalkableAt(cx - 1, cy + dy) && !this.isWalkableAt(cx - 1, cy))
                ) {
                    return { x: cx, y: cy }; // Forced neighbour found
                }
            }
        }

        // 4. Recursive Jump Continuation
        // For diagonal jumps, only continue the *diagonal* jump if absolutely necessary
        // (i.e., if the straight checks above didn't already return a jump point).
        // Also requires that the path components needed for the diagonal jump are clear.
        if (dx !== 0 && dy !== 0) {
            if (this.isWalkableAt(cx + dx, cy) || this.isWalkableAt(cx, cy + dy)) {
                return this.jump(cx + dx, cy + dy, cx, cy); // Continue diagonal jump
            } else {
                return null; // Cannot jump diagonally further (blocked)
            }
        } else {
            // Continue straight jump
            if (dx !== 0) {
                // Horizontal jump
                return this.jump(cx + dx, cy, cx, cy);
            } else {
                // Vertical jump (dy !== 0)
                return this.jump(cx, cy + dy, cx, cy);
            }
        }
    }

    private identifySuccessors(currentNode: GridLocation): void {
        const parent = this.visitedNodes.get(currentNode)?.predecessor;
        const neighboursToExplore = this.getPrunedNeighbours(currentNode, parent);

        for (const neighbour of neighboursToExplore) {
            // Determine jump direction from current node TO the neighbour/direction
            const jumpPointCoords = this.jump(
                neighbour.x,
                neighbour.y,
                currentNode.x,
                currentNode.y
            );

            if (jumpPointCoords) {
                // Get the grid node info at the jump point
                const gridNodeInfo = this.grid[jumpPointCoords.x][jumpPointCoords.y];
                // Create a GridLocation for the jump point to use in PQ and visitedNodes
                const jumpNode = new GridLocation(
                    jumpPointCoords.x,
                    jumpPointCoords.y,
                    gridNodeInfo.weight,
                    gridNodeInfo.status
                );

                const currentGCost = this.visitedNodes.get(currentNode).distance;
                const movementCost = this.getMovementCost(currentNode, jumpNode); // Cost between current and jump point
                // Add node weight *at the jump point*
                const tentativeGCost = currentGCost + movementCost + (jumpNode.weight || 0);

                const existingVisited = this.visitedNodes.get(jumpNode);
                const knownDistance = existingVisited?.distance ?? Number.POSITIVE_INFINITY;

                if (tentativeGCost < knownDistance) {
                    // Found a better path to this jump point
                    const heuristicCost = this.calculateHeuristic(jumpNode);
                    const totalCost = tentativeGCost + heuristicCost; // f = g + h

                    this.visitedNodes.put(jumpNode, {
                        predecessor: currentNode,
                        distance: tentativeGCost
                    });

                    this.grid[jumpNode.x][jumpNode.y].text = Math.round(tentativeGCost).toString();

                    const elementIndex = this.priorityQueue.indexOf(jumpNode);
                    if (elementIndex === -1) {
                        this.priorityQueue.enqueue(jumpNode, totalCost);
                        this.statRecords[1].currentValue += 1;
                        this.paintNode(jumpNode.x, jumpNode.y, 4); // Status 4: Queued
                    } else if (totalCost < this.priorityQueue.getPriority(elementIndex)) {
                        // Better path found, update priority
                        this.priorityQueue.update(jumpNode, totalCost);
                        // Node is already painted as queued, no need to repaint
                    }
                }
            }
        }
    }

    /**
     * Paints the grid cells along a line segment between two points.
     * @param x0 The x coordinate of the first point
     * @param y0 The y coordinate of the first point
     * @param x1 The x coordinate of the second point
     * @param y1 The y coordinate of the second point
     * */
    private paintLineSegment(x0: number, y0: number, x1: number, y1: number): void {
        const dx = Math.abs(x1 - x0);
        const dy = Math.abs(y1 - y0);
        const sx = x0 < x1 ? 1 : -1; // Step direction for x
        const sy = y0 < y1 ? 1 : -1; // Step direction for y

        let currentX = x0;
        let currentY = y0;

        // Determine the number of steps (max of dx or dy for grid lines)
        const steps = Math.max(dx, dy);

        for (let i = 0; i <= steps; i++) {
            this.paintNode(currentX, currentY, 8);

            // Decide which direction to step next based on simple diagonal/straight logic
            // This is a simplified grid line approach, not full Bresenham
            const errX = Math.abs(x1 - currentX);
            const errY = Math.abs(y1 - currentY);

            // Check if we have reached the end point exacty in terms of grid cells traversed
            if (currentX === x1 && currentY === y1) break; // Avoid overshooting

            // Prioritize moving along the axis with the larger remaining distance
            if (errX > errY) {
                currentX += sx;
            } else if (errY > errX) {
                currentY += sy;
            } else {
                // Diagonal step if distances are equal
                currentX += sx;
                currentY += sy;
            }
        }
        // Ensure the exact end point is painted (optional, depending on loop/paintNode logic)
        // this.paintNode(x1, y1, status);
    }

    public nextStep(): Node[][] {
        // Backtracking path visualization
        if (this.tracePath) {
            // Don't paint over start node when backtracking
            this.paintNode(this.tracePath.x, this.tracePath.y, 8); // Status 8: Fastest Path
        }

        if (!this.priorityQueue.isEmpty()) {
            const currentNode = this.priorityQueue.dequeue();

            // Goal check
            if (this.grid[currentNode.x][currentNode.y].status === 3) {
                this.tracePath = currentNode;
                this.priorityQueue.empty();
                this.paintNode(this.tracePath.x, this.tracePath.y, 8);
                return this.grid;
            }

            this.paintNode(currentNode.x, currentNode.y, 5);

            // JPS Core Logic: Find and process jump point successors ***
            this.identifySuccessors(currentNode);
        } else if (this.priorityQueue.isEmpty() && !this.tracePath) {
            return null;
        } else if (this.tracePath) {
            // Backtracing
            const predecessorLoc = this.visitedNodes.get(this.tracePath)?.predecessor;

            if (predecessorLoc && this.grid[this.tracePath.x][this.tracePath.y].status !== 2) {
                // We don't save every node inbetween the jump points.
                this.paintLineSegment(
                    predecessorLoc.x,
                    predecessorLoc.y,
                    this.tracePath.x,
                    this.tracePath.y
                );

                this.tracePath = predecessorLoc;
                this.paintNode(this.tracePath.x, this.tracePath.y, 8);
            } else {
                this.tracePath = null;
            }
        }

        return this.grid;
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        this.priorityQueue = new PriorityQueue();
        this.visitedNodes = new HashMap<GridLocation, VisitedNode>();
        this.tracePath = null; // Reset

        const initialHeuristic = this.calculateHeuristic(startLocation);
        this.priorityQueue.enqueue(startLocation, initialHeuristic);

        this.visitedNodes.put(startLocation, {
            predecessor: startLocation,
            distance: 0
        });
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.priorityQueue = deserializedState.priorityQueue;
        this.visitedNodes = deserializedState.visitedNodes;
        this.currentPath = deserializedState.currentPath;
        this.tracePath = deserializedState.tracePath;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        let tracePath: GridLocation | undefined = undefined;

        if (serializedState.tracePath) {
            tracePath = new GridLocation(
                serializedState.tracePath.x,
                serializedState.tracePath.y,
                serializedState.tracePath.weight,
                serializedState.tracePath.status
            );
        }

        const deserializedState = {
            priorityQueue: new PriorityQueue(),
            visitedNodes: new HashMap<GridLocation, VisitedNode>(),
            currentPath: [],
            tracePath: tracePath
        };
        serializedState.priorityQueue.forEach((element) => {
            const node = element.node;
            const loc = new GridLocation(node.x, node.y, node.weight, node.status);
            deserializedState.priorityQueue.enqueue(loc, element.priority);
        });

        serializedState.visitedNodes.forEach((ele) => {
            const key = new GridLocation(ele.key.x, ele.key.y, ele.key.weight, ele.key.status);
            const predecessor = ele.value.predecessor;
            const loc = new GridLocation(
                predecessor.x,
                predecessor.y,
                predecessor.weight,
                predecessor.status
            );
            const visitedNode: VisitedNode = {
                predecessor: loc,
                distance: ele.value.distance
            };
            deserializedState.visitedNodes.put(key, visitedNode);
        });
        for (let i = 0; i < serializedState.currentPath.length; i++) {
            const node = serializedState.currentPath[i];
            deserializedState.currentPath.push(
                new GridLocation(node.x, node.y, node.weight, node.status)
            );
        }
        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): object {
        const serializedState = {
            priorityQueue: this.priorityQueue.toObject(),
            visitedNodes: [],
            currentPath: [],
            tracePath: this.tracePath
        };

        this.visitedNodes.forEach((ele) => {
            const entry = { key: ele.toObject(), value: this.visitedNodes.get(ele) };
            serializedState.visitedNodes.push(entry);
        });
        for (let i = 0; i < this.currentPath.length; i++) {
            const node = this.currentPath[i];
            serializedState.currentPath.push(node.toObject());
        }
        return serializedState;
    }
    public getState(): object {
        return {
            priorityQueue: this.priorityQueue,
            visitedNodes: this.visitedNodes,
            currentPath: this.currentPath,
            tracePath: this.tracePath
        };
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Jump-PS';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
    public usesHeuristics(): boolean {
        return true;
    }
    public usesPathFindingSettings(): boolean {
        return false;
    }
    public forcesDiagonalMovement(): boolean {
        return true;
    }
}
