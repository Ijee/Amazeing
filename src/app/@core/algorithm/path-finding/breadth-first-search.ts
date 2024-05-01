import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';

type VisitedNode = { node: GridLocation; predecessor: GridLocation };

export class BreadthFirstSearch extends PathFindingAlgorithmAbstract {
    private queue: GridLocation[];
    private visitedNodes: VisitedNode[];
    // TODO: this can probably be removed and done differently
    // but I am lazy at this point. (Change it in DFS also)
    private tracePath: GridLocation;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Queue node',
                    type: 'status-5'
                },
                {
                    name: 'Explored node',
                    type: 'status-7'
                },
                {
                    name: 'Path found',
                    type: 'status-8'
                }
            ],
            {
                controls: []
            }
        );
        this.queue = [];
        this.visitedNodes = [];
        this.tracePath = null;
    }

    // private backtrace(): void {
    //     for (let i = 0; i < this.visitedNodes.length)
    // }

    /**
     * Checks if the node has already been explored.
     *
     * @param loc the location to check
     * @returns whether it is already explored
     */
    private isKnown(loc: GridLocation): boolean {
        for (let i = 0; i < this.visitedNodes.length; i++) {
            if (this.visitedNodes[i].node.equals(loc)) {
                return true;
            }
        }
        return false;
    }

    public nextStep(): Node[][] {
        if (this.queue.length !== 0) {
            const currLoc = this.queue.shift();
            this.paintNode(currLoc.x, currLoc.y, 7);
            if (currLoc.status === 3) {
                this.queue = [];
                this.tracePath = currLoc;
            } else {
                const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                    return neighbour.status !== 1;
                });
                for (let i = 0; i < neighbours.length; i++) {
                    const neighbour = neighbours[i];
                    if (!this.isKnown(neighbour)) {
                        this.visitedNodes.push({ node: neighbour, predecessor: currLoc });
                        this.queue.push(neighbour);
                        this.paintNode(neighbour.x, neighbour.y, 5);
                    }
                }
            }
            return this.grid;
        } else {
            // show path
            if (this.tracePath === null) {
                return null;
            } else {
                for (let i = 0; i < this.visitedNodes.length; i++) {
                    const visitedNode = this.visitedNodes[i];
                    if (visitedNode.node.equals(this.tracePath)) {
                        this.paintNode(this.tracePath.x, this.tracePath.y, 8);
                        this.tracePath = visitedNode.predecessor;
                    }
                }
                return this.grid;
            }
        }
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.queue.push(startLocation);
        this.visitedNodes.push({ node: startLocation, predecessor: null });
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.queue = deserializedState.queue;
        this.visitedNodes = deserializedState.visitedNodes;
        this.tracePath = deserializedState.tracePath;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const queue: GridLocation[] = [];
        serializedState.queue.forEach((ele) => {
            const tempQueueEle = new GridLocation(ele.x, ele.y, ele.weight, ele.status);
            queue.push(tempQueueEle);
        });
        const visitedNodes: VisitedNode[] = [];
        serializedState.queue.forEach((ele: VisitedNode) => {
            // const tempQueueEle =  new GridLocation(ele.x, ele.y, ele.weight, ele.status);
            const node = ele.node;
            const predecessor = ele.predecessor;
            const visitedNode = {
                node: new GridLocation(node.x, node.y, node.weight, node.status),
                predecessor: new GridLocation(
                    predecessor.x,
                    predecessor.y,
                    predecessor.weight,
                    predecessor.status
                )
            };
            visitedNodes.push(visitedNode);
        });
        const tracePath = serializedState.tracePath;
        const deserializedState = {
            queue: queue,
            visitedNodes: visitedNodes,
            tracePath: new GridLocation(
                tracePath.x,
                tracePath.y,
                tracePath.weight,
                tracePath.status
            )
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): Object {
        const serializedState = {
            queue: [],
            visitedNodes: []
        };
        this.queue.forEach((gridLocation) => {
            serializedState.queue.push(gridLocation.toObject());
        });
        this.visitedNodes.forEach((ele) => {
            serializedState.visitedNodes.push({
                node: ele.node.toObject(),
                predecessor: ele.predecessor.toObject()
            });
        });
        return serializedState;
    }
    public getState(): Object {
        return {
            queue: this.queue,
            visitedNodes: this.visitedNodes
        };
    }
    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Breadth-FS';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
    public usesHeuristics(): boolean {
        return false;
    }
}
