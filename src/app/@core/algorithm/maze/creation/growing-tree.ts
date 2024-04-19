import {
    Direction,
    MazeAlgorithm,
    Node,
    NodeCollection,
    Statistic
} from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { getRandomNumber } from '../../../../@shared/utils/general-utils';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';

export class GrowingTree extends MazeAlgorithmAbstract {
    private nodeCollection: NodeCollection;

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
            },
            {}
        );
        this.nodeCollection = [] as any;
    }

    /**
     * Selects the node for the current iteration.
     * @private
     */
    private selectLocation(): [gridLocation: GridLocation, selectedNodeIndex: number] {
        // TODO add more options to select locations
        let loc: GridLocation;
        let selectedNodeIndex: number;
        switch (this.options['Node Selection']) {
            case 'Newest First (Recursive Backtracker)':
                loc = this.nodeCollection[this.nodeCollection.length - 1].gridLocation;
                selectedNodeIndex = this.nodeCollection.length - 1;
                break;
            case "Random (Prim's)":
                selectedNodeIndex = Math.floor(Math.random() * this.nodeCollection.length);
                loc = this.nodeCollection[selectedNodeIndex].gridLocation;
                break;
            case 'Oldest':
                loc = this.nodeCollection[0].gridLocation;
                selectedNodeIndex = 0;
                break;
            default:
                throw new Error('Unknown algorithm option.');
        }

        return [loc, selectedNodeIndex];
    }

    /**
     * This function determines the direction from which a node has been build
     * to from. This is important here because we can not be certain what nodes
     * to repaint once we delete nodes form our nodeCollection.
     * Annoying but needed in a grid where a node is either a wall or something else.
     *
     * @param loc the node where we built walls
     * @private
     */
    private determineDirection(loc: GridLocation): Direction {
        let direction: Direction = 'unknown';
        if (this.currentGrid?.[loc.x]?.[loc.y - 1]?.status === 5) {
            direction = 'up';
        } else if (this.currentGrid?.[loc.x + 1]?.[loc.y]?.status === 5) {
            direction = 'right';
        } else if (this.currentGrid?.[loc.x]?.[loc.y + 1]?.status === 5) {
            direction = 'down';
        } else if (this.currentGrid?.[loc.x - 1]?.[loc.y]?.status === 5) {
            direction = 'left';
        }
        return direction;
    }

    public nextStep(): Node[][] {
        if (this.nodeCollection.length > 0) {
            let [selectedNode, selectedNodeIndex] = this.selectLocation();
            let neighbours = this.getNeighbours(selectedNode, 2);
            let viableNeighbourFound = false;
            if (neighbours.length > 0) {
                neighbours = shuffleFisherYates(neighbours);
                for (let i = 0; i < neighbours.length; i++) {
                    let neighbour = neighbours[i];
                    if (this.currentGrid[neighbour.x][neighbour.y].status === 0) {
                        this.buildWalls(neighbour, 0);
                        this.buildPath(selectedNode, neighbour, 5);
                        this.nodeCollection.push({
                            gridLocation: neighbour,
                            direction: this.determineDirection(neighbour)
                        });
                        viableNeighbourFound = true;
                        // So we avoid repainting start and goal
                        if (
                            this.currentGrid[neighbour.x][neighbour.y].status !== 2 &&
                            this.currentGrid[neighbour.x][neighbour.y].status !== 3
                        ) {
                            this.currentGrid[neighbour.x][neighbour.y].status = 5;
                        }
                        break;
                    }
                }
            }
            if (!viableNeighbourFound) {
                // Repaint the other node that would stay behind otherwise.
                // (The buildPath(...) node)
                switch (this.nodeCollection[selectedNodeIndex].direction) {
                    case 'up':
                        this.currentGrid[selectedNode.x][selectedNode.y - 1].status = 9;
                        break;
                    case 'right':
                        this.currentGrid[selectedNode.x + 1][selectedNode.y].status = 9;
                        break;
                    case 'down':
                        this.currentGrid[selectedNode.x][selectedNode.y + 1].status = 9;
                        break;
                    case 'left':
                        this.currentGrid[selectedNode.x - 1][selectedNode.y].status = 9;
                        break;
                    default:
                }
                this.currentGrid[selectedNode.x][selectedNode.y].status = 9;
                this.nodeCollection.splice(selectedNodeIndex, 1);
            }
            this.statRecords[0].currentValue = this.nodeCollection.length * 2;
            return this.currentGrid;
        }
        return null;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;
        // idk, it was late. make it make more sense.
        // I only do this because I want the starting point to be on the same axis as the starting point.
        // It is not even needed for the algorithm, and it's probably doable in a one-liner.
        let randomXPosition =
            currentStartPoint.x % 2 === 0
                ? getRandomNumber(0, currentGrid.length, 2)
                : getRandomNumber(1, currentGrid.length, 2);

        let randomYPosition =
            currentStartPoint.y % 2 === 0
                ? getRandomNumber(0, currentGrid[0].length, 2)
                : getRandomNumber(1, currentGrid[0].length, 2);
        let startNode = new GridLocation(randomXPosition, randomYPosition);
        this.nodeCollection.push({ gridLocation: startNode, direction: 'unknown' });

        this.buildWalls(startNode, 0);
        this.currentGrid[startNode.x][startNode.y].status = 5;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.nodeCollection = deserializedState.nodeCollection;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const deserializedState = {
            nodeCollection: []
        };
        serializedState.nodeCollection.forEach(
            (arr: { gridLocation: GridLocation; direction: Direction }, index: number) => {
                const loc = new GridLocation(arr.gridLocation.x, arr.gridLocation.y);
                deserializedState.nodeCollection.push({
                    gridLocation: loc,
                    direction: arr.direction
                });
            }
        );
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            nodeCollection: []
        };
        this.nodeCollection.forEach((arr) => {
            serializedState.nodeCollection.push({
                gridLocation: arr.gridLocation.toObject(),
                direction: arr.direction
            });
        });
        return serializedState;
    }

    public getState(): Object {
        return {
            nodeCollection: this.nodeCollection
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Growing-Tree';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
