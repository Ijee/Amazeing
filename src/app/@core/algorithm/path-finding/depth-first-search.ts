import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';

interface VisitedNode { node: GridLocation; predecessor: GridLocation }

export class DepthFirstSearch extends PathFindingAlgorithmAbstract {
    private stack: GridLocation[];
    private visitedNodes: VisitedNode[];
    // TODO: this can probably be removed and done differently
    // but I am lazy at this point. (Change it in BFS also)
    private tracePath: GridLocation;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Stack node',
                    type: 'status-4'
                },
                {
                    name: 'Explored node',
                    type: 'status-5'
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
        this.stack = [];
        this.visitedNodes = [];
        this.tracePath = null;
    }

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
        if (this.stack.length !== 0) {
            const currLoc = this.stack.pop();
            this.paintNode(currLoc.x, currLoc.y, 5);
            if (currLoc.status === 3) {
                this.stack = [];
                this.tracePath = currLoc;
            } else {
                const neighbours = this.getNeighbours(currLoc, 1).filter((neighbour) => {
                    return neighbour.status !== 1;
                });
                for (let i = 0; i < neighbours.length; i++) {
                    const neighbour = neighbours[i];
                    if (!this.isKnown(neighbour)) {
                        this.visitedNodes.push({ node: neighbour, predecessor: currLoc });
                        this.stack.push(neighbour);
                        this.paintNode(neighbour.x, neighbour.y, 4);
                    }
                }
            }
            return this.grid;
        } else {
            // show path
            for (let i = 0; i < this.visitedNodes.length; i++) {
                const visitedNode = this.visitedNodes[i];
                if (this.tracePath.status === 2) {
                    return null;
                } else if (visitedNode.node.equals(this.tracePath)) {
                    this.tracePath = visitedNode.predecessor;
                }
                this.paintNode(this.tracePath.x, this.tracePath.y, 8);
            }
            return this.grid;
        }
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.stack.push(startLocation);
        this.visitedNodes.push({ node: startLocation, predecessor: startLocation });
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.stack = deserializedState.stack;
        this.visitedNodes = deserializedState.visitedNodes;
        this.tracePath = deserializedState.tracePath;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const stack: GridLocation[] = [];
        serializedState.stack.forEach((ele) => {
            const temStackEle = new GridLocation(ele.x, ele.y, ele.weight, ele.status);
            stack.push(temStackEle);
        });
        const visitedNodes: VisitedNode[] = [];
        serializedState.visitedNodes.forEach((ele: VisitedNode) => {
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
            stack: stack,
            visitedNodes: visitedNodes,
            tracePath: tracePath
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
        let tracePathObj: object | undefined = undefined;
        if (this.tracePath) {
            tracePathObj = this.tracePath.toObject();
        }
        const serializedState = {
            stack: [],
            visitedNodes: [],
            tracePath: tracePathObj
        };
        this.stack.forEach((gridLocation) => {
            serializedState.stack.push(gridLocation.toObject());
        });
        this.visitedNodes.forEach((ele) => {
            serializedState.visitedNodes.push({
                node: ele.node.toObject(),
                predecessor: ele.predecessor.toObject()
            });
        });
        return serializedState;
    }

    public getState(): object {
        return {
            stack: this.stack,
            visitedNodes: this.visitedNodes,
            tracePath: this.tracePath
        };
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'Depth-FS';
    }

    public usesNodeWeights(): boolean {
        return false;
    }

    public usesHeuristics(): boolean {
        return false;
    }

    public usesPathFindingSettings(): boolean {
        return true;
    }

    public forcesDiagonalMovement(): boolean {
        return false;
    }
}
