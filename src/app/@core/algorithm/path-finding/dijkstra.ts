import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { GridLocation } from '../../../@shared/classes/GridLocation';
import { Node, PathFindingAlgorithm, Statistic } from '../../types/algorithm.types';
import { PriorityQueue } from '../../../@shared/classes/PriorityQueue';

type DijkstraNode = { predecessor: GridLocation; distance: number };
// TODO: I don't like this implementation at all and it should at least be revised if not
// rewritten in the future. blame @Ijee

export class Dijkstra extends PathFindingAlgorithmAbstract {
    private priorityQueue: PriorityQueue;
    private dijkstraNodes: DijkstraNode[][];
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
        this.dijkstraNodes = [];
    }

    /**
     *
     *
     * @param neighbour the neighbour location
     * @param currLoc the current location
     */
    private updateDistance(neighbour: GridLocation, currLoc: GridLocation): void {
        const currNode = this.dijkstraNodes[currLoc.x][currLoc.y];

        const neighbourNode = this.dijkstraNodes[neighbour.x][neighbour.y];

        const alternativeDistance = currNode.distance + neighbour.weight;
        if (alternativeDistance < neighbourNode.distance) {
            this.dijkstraNodes[neighbour.x][neighbour.y].distance = alternativeDistance;
            this.dijkstraNodes[neighbour.x][neighbour.y].predecessor = currLoc;
        }
    }

    public nextStep(): Node[][] {
        if (!this.priorityQueue.isEmpty()) {
            const currLoc = this.priorityQueue.dequeue();
            if (this.grid[currLoc.x][currLoc.y].status === 3) {
                this.tracePath = currLoc;
                this.priorityQueue.empty();
                return this.grid;
            }
            this.paintNode(currLoc.x, currLoc.y, 5);

            const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                return neighbour.status !== 1;
            });
            neighbours.forEach((neighbour) => {
                if (this.dijkstraNodes[neighbour.x][neighbour.y].predecessor === null) {
                    const newDistance = (this.dijkstraNodes[neighbour.x][neighbour.y].distance =
                        neighbour.weight + this.dijkstraNodes[currLoc.x][currLoc.y].distance);
                    this.dijkstraNodes[neighbour.x][neighbour.y].distance = newDistance;
                    this.grid[neighbour.x][neighbour.y].text = newDistance.toString();
                    this.dijkstraNodes[neighbour.x][neighbour.y].predecessor = currLoc;
                    this.priorityQueue.enqueue(neighbour, newDistance);
                    this.paintNode(neighbour, 4);
                } else {
                    this.updateDistance(neighbour, currLoc);
                }
            });
        } else {
            // show path
            if (this.tracePath === null) {
                return null;
            } else {
                const predecessor =
                    this.dijkstraNodes[this.tracePath.x][this.tracePath.y].predecessor;
                this.paintNode(this.tracePath.x, this.tracePath.y, 8);

                if (this.grid[predecessor.x][predecessor.y].status === 2) {
                    this.tracePath = null;
                } else {
                    this.tracePath = predecessor;
                }
            }
        }
        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.priorityQueue.enqueue(startLocation, 0);

        // initial distances (excluding walls)

        for (let i = 0; i < this.grid.length; i++) {
            this.dijkstraNodes[i] = [];
            for (let j = 0; j < this.grid[0].length; j++) {
                let node = this.grid[i][j];
                if (this.grid[i][j].status !== 2 && this.grid[i][j].status !== 1) {
                    node.text = '∞';
                    const DijkstraNode: DijkstraNode = {
                        predecessor: null,
                        distance: 9999
                    };
                    this.dijkstraNodes[i][j] = DijkstraNode;
                } else if (this.grid[i][j].status === 2) {
                    node.text = '0';
                    node.weight = 0;

                    const DijkstraNode: DijkstraNode = {
                        predecessor: null,
                        distance: 0
                    };
                    this.dijkstraNodes[i][j] = DijkstraNode;
                }
            }
        }
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.priorityQueue = deserializedState.priorityQueue;
        this.dijkstraNodes = deserializedState.distances;
        this.tracePath = deserializedState.tracePath;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const tracePath = serializedState.tracePath;
        const deserializedState = {
            priorityQueue: new PriorityQueue(),
            dijkstraNodes: [],
            tracePath: new GridLocation(
                tracePath.x,
                tracePath.y,
                tracePath.weight,
                tracePath.status
            )
        };
        for (let i = 0; i < serializedState.dijkstraNodes.length; i++) {
            deserializedState[i].dijkstraNodes = [];
            for (let j = 0; j < this.grid[0].length; j++) {
                let element = serializedState.dijkstraNodes[i][j];
                let predecessor = element.predecessor;
                let loc = new GridLocation(
                    predecessor.x,
                    predecessor.y,
                    predecessor.weight,
                    predecessor.status
                );
                this.dijkstraNodes[i][j] = { predecessor: loc, distance: element.distance };
            }
        }
        serializedState.priorityQueue.forEach((element) => {
            const node = element.node;
            const loc = new GridLocation(node.x, node.y, node.weight, node.status);
            deserializedState.priorityQueue.enqueue(loc, element.priority);
        });
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            priorityQueue: this.priorityQueue.toObject(),
            dijkstraNodes: [],
            tracePath: this.tracePath.toObject()
        };
        for (let i = 0; i < serializedState.dijkstraNodes.length; i++) {
            serializedState[i].dijkstraNodes = [];
            for (let j = 0; j < this.grid[0].length; j++) {
                let element = this.dijkstraNodes[i][j];

                serializedState.dijkstraNodes[i][j] = {
                    predecessor: element.predecessor.toObject(),
                    distance: element.distance
                };
            }
        }
        return serializedState;
    }

    public getState(): Object {
        return {
            priorityQueue: this.priorityQueue,
            dijkstraNodes: this.dijkstraNodes,
            tracePath: this.tracePath
        };
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Dijkstra';
    }

    public usesNodeWeights(): boolean {
        return true;
    }

    public usesHeuristics(): boolean {
        return false;
    }
}
