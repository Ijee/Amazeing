import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { PriorityQueue } from 'src/app/@shared/classes/PriorityQueue';
import { HashMap } from 'src/app/@shared/classes/HasMap';

export class BestFIrstSearch extends PathFindingAlgorithmAbstract {
    private priorityQueue: PriorityQueue;
    private visitedNodes: HashMap<GridLocation, GridLocation>;
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
                }
            ],
            {
                controls: []
            }
        );
        this.priorityQueue = new PriorityQueue();
        this.visitedNodes = new HashMap<GridLocation, GridLocation>();
    }

    public nextStep(): Node[][] | null {
        if (!this.priorityQueue.isEmpty()) {
            const currLoc = this.priorityQueue.dequeue();
            if (this.grid[currLoc.x][currLoc.y].status === 3) {
                // Goal check
                this.tracePath = currLoc;
                this.priorityQueue.empty();
                return this.grid;
            }
            this.paintNode(currLoc.x, currLoc.y, 5); // Mark as visited

            const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                return neighbour.status !== 1; // Filter out walls or obstacles
            });
            neighbours.forEach((neighbour) => {
                if (!this.visitedNodes.contains(neighbour)) {
                    const distance = this.calculateHeuristic(neighbour) + (neighbour.weight || 0);
                    this.visitedNodes.put(neighbour, currLoc);
                    this.priorityQueue.enqueue(neighbour, distance);
                    this.paintNode(neighbour.x, neighbour.y, 4); // Mark as queued
                }
            });
        } else if (this.priorityQueue.isEmpty() && !this.tracePath) {
            // No path to goal exists.
            return null;
        } else if (this.tracePath) {
            // Backtracking to show the path
            this.paintNode(this.tracePath.x, this.tracePath.y, 8); // Paint the path
            this.tracePath = this.visitedNodes.get(this.tracePath) || undefined;
            if (this.grid[this.tracePath.x][this.tracePath.y].status === 2) {
                this.tracePath = null;
            }
        }
        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.priorityQueue.enqueue(startLocation, 0);
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.priorityQueue = deserializedState.priorityQueue;
        this.visitedNodes = deserializedState.visitedNodes;
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
            visitedNodes: new HashMap<GridLocation, GridLocation>(),
            tracePath: tracePath
        };
        serializedState.priorityQueue.forEach((element) => {
            const node = element.node;
            const loc = new GridLocation(node.x, node.y, node.weight, node.status);
            deserializedState.priorityQueue.enqueue(loc, element.priority);
        });

        serializedState.visitedNodes.forEach((ele) => {
            deserializedState.visitedNodes.put(ele.key, ele.value);
        });

        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        let tracePathObj: object | undefined = undefined;
        if (this.tracePath) {
            tracePathObj = this.tracePath.toObject();
        }
        const serializedState = {
            priorityQueue: this.priorityQueue.toObject(),
            visitedNodes: [],
            tracePath: tracePathObj
        };

        this.visitedNodes.forEach((ele) => {
            const entry = { key: ele.toObject(), value: this.visitedNodes.get(ele).toObject() };
            serializedState.visitedNodes.push(entry);
        });

        return serializedState;
    }

    public getState(): Object {
        return {
            priorityQueue: this.priorityQueue,
            visitedNodes: this.visitedNodes,
            tracePath: this.tracePath
        };
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Best-FS';
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
