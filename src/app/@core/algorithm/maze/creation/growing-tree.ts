import {
    Direction,
    MazeAlgorithm,
    Node,
    NodeDirection,
    Statistic
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { getRandomNumber } from '../../../../@shared/utils/general-utils';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';

export class GrowingTree extends MazeAlgorithmAbstract {
    private nodeDirections: NodeDirection[];
    // TODO: is there a way not to have these variables? primarily for newest first option "backtracking" / repainting
    private startAlreadyAdded: boolean;
    private goalAlreadyAdded: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Added Nodes',
                    type: 'status-5',
                    currentValue: 0
                }
            ],
            {
                controls: [
                    {
                        name: 'Node Selection',
                        label: 'Node Selection',
                        value: 'Newest First (Recursive Backtracker)',
                        values: [
                            'Newest First (Recursive Backtracker)',
                            "Random (Prim's)",
                            'Oldest'
                        ],
                        type: 'select',
                        validators: {
                            required: true
                        }
                    }
                ]
            }
        );
        this.nodeDirections = [] as any;
        this.startAlreadyAdded = false;
        this.goalAlreadyAdded = false;
    }

    /**
     * Selects the node for the current iteration.
     * @private
     */
    private selectLocation(): [gridLocation: GridLocation, selectedNodeIndex: number] {
        let loc: GridLocation;
        let selectedNodeIndex: number;
        switch (this.options['Node Selection']) {
            case 'Newest First (Recursive Backtracker)':
                loc = this.nodeDirections[this.nodeDirections.length - 1].gridLocation;
                selectedNodeIndex = this.nodeDirections.length - 1;
                break;
            case "Random (Prim's)":
                selectedNodeIndex = Math.floor(Math.random() * this.nodeDirections.length);
                loc = this.nodeDirections[selectedNodeIndex].gridLocation;
                break;
            case 'Oldest':
                loc = this.nodeDirections[0].gridLocation;
                selectedNodeIndex = 0;
                break;
            default:
                throw new Error('Unknown algorithm option.');
        }

        return [loc, selectedNodeIndex];
    }

    /**
     * This function determines the direction from which a node has been build
     * from. This is important here because we can not be certain what nodes
     * to repaint once we delete nodes form our nodeCollection.
     * Annoying but needed in a grid where a node is either a wall or something else.
     *
     * @param loc the node where we built walls
     * @private
     */
    private determineDirection(loc: GridLocation): Direction {
        let direction: Direction = 'unknown';
        if (this.grid?.[loc.x]?.[loc.y - 1]?.status === 5) {
            direction = 'up';
        } else if (this.grid?.[loc.x + 1]?.[loc.y]?.status === 5) {
            direction = 'right';
        } else if (this.grid?.[loc.x]?.[loc.y + 1]?.status === 5) {
            direction = 'down';
        } else if (this.grid?.[loc.x - 1]?.[loc.y]?.status === 5) {
            direction = 'left';
        }
        return direction;
    }

    public nextStep(): Node[][] {
        if (this.nodeDirections.length > 0) {
            const [selectedNode, selectedNodeIndex] = this.selectLocation();
            let neighbours = this.getNeighbours(selectedNode, 2);
            let viableNeighbourFound = false;
            if (neighbours.length > 0) {
                neighbours = shuffleFisherYates(neighbours);
                for (let i = 0; i < neighbours.length; i++) {
                    const neighbour = neighbours[i];
                    if (
                        this.grid[neighbour.x][neighbour.y].status === 0 ||
                        (this.grid[neighbour.x][neighbour.y].status === 2 &&
                            !this.startAlreadyAdded) ||
                        (this.grid[neighbour.x][neighbour.y].status === 3 && !this.goalAlreadyAdded)
                    ) {
                        this.buildWalls(neighbour, 0);
                        this.buildPath(selectedNode, neighbour, 5);
                        this.nodeDirections.push({
                            gridLocation: neighbour,
                            direction: this.determineDirection(neighbour)
                        });
                        viableNeighbourFound = true;
                        if (this.grid[neighbour.x][neighbour.y].status === 2) {
                            this.startAlreadyAdded = true;
                        } else if (this.grid[neighbour.x][neighbour.y].status === 3) {
                            this.goalAlreadyAdded = true;
                        }
                        this.paintNode(neighbour.x, neighbour.y, 5);

                        break;
                    }
                }
            }
            if (!viableNeighbourFound) {
                // Repaint the other node that would stay behind otherwise.
                // (The buildPath(...) node)
                switch (this.nodeDirections[selectedNodeIndex].direction) {
                    case 'up':
                        this.paintNode(selectedNode.x, selectedNode.y - 1, 9);
                        break;
                    case 'right':
                        this.paintNode(selectedNode.x + 1, selectedNode.y, 9);
                        break;
                    case 'down':
                        this.paintNode(selectedNode.x, selectedNode.y + 1, 9);
                        break;
                    case 'left':
                        this.paintNode(selectedNode.x - 1, selectedNode.y, 9);
                        break;
                    default:
                }
                // this.grid[selectedNode.x][selectedNode.y].status = 9;
                this.paintNode(selectedNode.x, selectedNode.y, 9);
                this.nodeDirections.splice(selectedNodeIndex, 1);
            }
            this.statRecords[0].currentValue = this.nodeDirections.length * 2;
            return this.grid;
        }
        return null;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        // idk, it was late. make it make more sense.
        // I only do this because I want the starting point to be on the same axis as the starting point.
        // It is not even needed for the algorithm, and it's probably doable in a one-liner.
        const randomXPosition =
            startLocation.x % 2 === 0
                ? getRandomNumber(0, grid.length, 2)
                : getRandomNumber(1, grid.length, 2);

        const randomYPosition =
            startLocation.y % 2 === 0
                ? getRandomNumber(0, grid[0].length, 2)
                : getRandomNumber(1, grid[0].length, 2);
        const startNode = new GridLocation(randomXPosition, randomYPosition);
        this.nodeDirections.push({ gridLocation: startNode, direction: 'unknown' });

        this.buildWalls(startNode, 0);
        this.grid[startNode.x][startNode.y].status = 5;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.nodeDirections = deserializedState.nodeCollection;
        this.startAlreadyAdded = deserializedState.startAlreadyAdded;
        this.goalAlreadyAdded = deserializedState.goalAlreadyAdded;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const deserializedState = {
            nodeCollection: [],
            startAlreadyAdded: serializedState.startAlreadyAdded,
            goalAlreadyAdded: serializedState.goalAlreadyAdded
        };
        serializedState.nodeCollection.forEach(
            (arr: { gridLocation: GridLocation; direction: Direction }) => {
                const loc = new GridLocation(arr.gridLocation.x, arr.gridLocation.y);
                deserializedState.nodeCollection.push({
                    gridLocation: loc,
                    direction: arr.direction
                });
            }
        );
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
        const serializedState = {
            nodeCollection: [],
            startAlreadyAdded: this.startAlreadyAdded,
            goalAlreadyAdded: this.goalAlreadyAdded
        };
        this.nodeDirections.forEach((arr) => {
            serializedState.nodeCollection.push({
                gridLocation: arr.gridLocation.toObject(),
                direction: arr.direction
            });
        });
        return serializedState;
    }

    public getState(): object {
        return {
            nodeCollection: this.nodeDirections,
            startAlreadyAdded: this.startAlreadyAdded,
            goalAlradyAdded: this.goalAlreadyAdded
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Growing-Tree';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
