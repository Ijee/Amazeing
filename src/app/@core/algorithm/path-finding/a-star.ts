import { HashMap } from 'src/app/@shared/classes/HasMap';
import { PriorityQueue } from 'src/app/@shared/classes/PriorityQueue';
import { GridLocation } from '../../../@shared/classes/GridLocation';
import { Node, PathFindingAlgorithm, Statistic, VisitedNode } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';

export class AStar extends PathFindingAlgorithmAbstract {
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
                    name: 'Visited',
                    type: 'status-5'
                },
                {
                    name: 'Fastest Path',
                    type: 'status-8'
                },
                {
                    name: 'Current Path (optional)',
                    type: 'status-6'
                }
            ],
            {
                controls: [
                    {
                        name: 'Show current path',
                        label: 'Show current path',
                        value: '',
                        type: 'checkbox',
                        validators: {
                            required: true
                        }
                    }
                ]
            }
        );
        this.priorityQueue = new PriorityQueue();
        this.visitedNodes = new HashMap<GridLocation, VisitedNode>();
        this.currentPath = [];
    }

    /**
     * Calculates whether a better path is available for a neighbour node.
     *
     * @param currentNode the current node
     * @param neighbourNode the neighbour node
     */
    private relaxation(currentNode: GridLocation, neighbourNode: GridLocation): void {
        const currentDistance = this.visitedNodes.get(currentNode).distance;
        const neighbourDistance =
            this.visitedNodes.get(neighbourNode)?.distance ?? Number.POSITIVE_INFINITY;

        // Calculate tentative g-cost
        const tentativeGCost = currentDistance + neighbourNode.weight;
        // Was an idea to "fix" diagonal paths taking precedence when available.
        // Math.sqrt(
        //     Math.pow(currentNode.x - neighbourNode.x, 2) +
        //         Math.pow(currentNode.y - neighbourNode.y, 2)
        // );

        if (tentativeGCost < neighbourDistance) {
            // Compare tentative g-cost with the current distance
            const heuristicCost = this.calculateHeuristic(neighbourNode);
            const totalCost = tentativeGCost + heuristicCost; // Total cost is g(n) + h(n)

            this.visitedNodes.put(neighbourNode, {
                predecessor: currentNode,
                distance: tentativeGCost
            });
            // this.visitedNodes.put(neighbourNode, updatedVisitedNode);
            if (this.priorityQueue.indexOf(neighbourNode) === -1) {
                this.priorityQueue.enqueue(neighbourNode, totalCost);
                this.paintNode(neighbourNode.x, neighbourNode.y, 4);
            } else {
                // Update the priority queue with the total cost (g + h)
                this.priorityQueue.update(neighbourNode, totalCost);
            }

            this.grid[neighbourNode.x][neighbourNode.y].text = tentativeGCost.toString();
            // Same idea as above for diagonal paths but it just makes it more connfusing.
            // this.grid[neighbourNode.x][neighbourNode.y].text =
            //     Math.round(tentativeGCost).toString();
        }
    }

    public nextStep(): Node[][] {
        // Paints the current path back
        for (let i = 0; i < this.currentPath.length; i++) {
            const node = this.currentPath[i];
            this.paintNode(node.x, node.y, 5);
        }
        this.currentPath = [];

        if (!this.priorityQueue.isEmpty()) {
            const currLoc = this.priorityQueue.dequeue();

            if (this.grid[currLoc.x][currLoc.y].status === 3) {
                this.tracePath = currLoc;
                this.priorityQueue.empty();
                return this.grid;
            }
            this.paintNode(currLoc.x, currLoc.y, 5);
            if (this.options['Show current path']) {
                let pathNode = currLoc;
                while (pathNode) {
                    if (pathNode.status === 2) {
                        pathNode = undefined;
                    } else {
                        pathNode = this.visitedNodes.get(pathNode).predecessor;
                        this.currentPath.push(pathNode);
                        this.paintNode(pathNode.x, pathNode.y, 6);
                    }
                }
            }
            const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                return neighbour.status !== 1;
            });
            neighbours.forEach((neighbour) => {
                this.relaxation(currLoc, neighbour);
            });
        } else if (this.priorityQueue.isEmpty() && !this.tracePath) {
            // No path to goal exists.
            return null;
        } else if (this.tracePath) {
            // Backtracking to show the path
            this.paintNode(this.tracePath.x, this.tracePath.y, 8); // Paint the path
            this.tracePath = this.visitedNodes.get(this.tracePath).predecessor || undefined;
            if (this.grid[this.tracePath.x][this.tracePath.y].status === 2) {
                this.tracePath = null;
            }
        }

        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.priorityQueue.enqueue(startLocation, 0);
        this.visitedNodes.put(startLocation, {
            predecessor: startLocation,
            distance: 0
        });

        // initial distances (excluding walls)

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const node = this.grid[i][j];
                if (this.grid[i][j].status !== 2 && this.grid[i][j].status !== 1) {
                    node.text = '∞';
                } else if (this.grid[i][j].status === 2) {
                    node.text = '0';
                    node.weight = 0;
                }
            }
        }
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
        return 'A-Star';
    }

    public usesNodeWeights(): boolean {
        return true;
    }

    public usesHeuristics(): boolean {
        return true;
    }
    public usesPathFindingSettings(): boolean {
        return true;
    }
    public forcesDiagonalMovement(): boolean {
        return false;
    }
}
