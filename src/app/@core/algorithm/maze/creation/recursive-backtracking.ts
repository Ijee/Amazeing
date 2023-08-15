import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { MazeAlgorithm, Node, StatRecord } from '../../../types/algorithm.types';

export class RecursiveBacktracking extends MazeAlgorithmAbstract {
    private cursor: GridLocation;
    private walkingPath: GridLocation[];
    private visitedNodes: HashSet<GridLocation>;
    private backtrack: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Found Nodes',
                    type: 'status-5'
                },
                {
                    name: 'Backtracking Distance',
                    type: 'status-none',
                    currentValue: 0
                }
            ],
            {
                controls: []
            },
            {}
        );
        this.walkingPath = [];
        this.visitedNodes = new HashSet<GridLocation>();
        this.backtrack = false;
    }

    public nextStep(): Node[][] {
        if (this.backtrack) {
            if (this.walkingPath.length >= 2) {
                // paint the grid back
                this.currentGrid[this.cursor.x][this.cursor.y].status = 0;
                this.buildPath(this.cursor, this.walkingPath[this.walkingPath.length - 2], 0);
                this.walkingPath.pop();
            } else {
                return null;
            }
            let backtrackNeighbours = this.getNeighbours(
                this.walkingPath[this.walkingPath.length - 1],
                2
            );
            backtrackNeighbours = shuffleFisherYates(backtrackNeighbours);
            let previousLocation = this.walkingPath[this.walkingPath.length - 1];
            // see if there are valid neighbours so we can build again
            for (let i = 0; i < backtrackNeighbours.length - 1; i++) {
                let node = backtrackNeighbours[i];
                if (
                    !this.visitedNodes.contains(node) &&
                    this.currentGrid[node.x][node.y].status === 0
                ) {
                    this.visitedNodes.add(this.cursor);
                    this.backtrack = false;
                    this.cursor = previousLocation;
                    break;
                }
                // so we can go further back
                this.visitedNodes.add(this.cursor);
                this.cursor = previousLocation;
                this.statRecords[1].currentValue += 1;
            }
        } else {
            // building
            console.log('building');
            this.statRecords[1].currentValue = 0;
            let neighbours = this.getNeighbours(this.cursor, 2);
            neighbours = shuffleFisherYates(neighbours);
            this.backtrack = true;
            for (let i = 0; i < neighbours.length; i++) {
                let node = neighbours[i];
                if (
                    !this.visitedNodes.contains(node) &&
                    this.currentGrid[node.x][node.y].status === 0
                ) {
                    // this.buildWalls(this.cursor, 0);
                    this.buildWalls(node, 0);
                    this.buildPath(this.cursor, node, 5);
                    this.cursor = node;
                    this.walkingPath.push(node);
                    this.backtrack = false;

                    if (
                        this.currentGrid[this.cursor.x][this.cursor.y].status !== 2 &&
                        this.currentGrid[this.cursor.x][this.cursor.y].status !== 3
                    ) {
                        this.currentGrid[node.x][node.y].status = 5;
                        this.currentGrid[this.cursor.x][this.cursor.y].status = 5;
                    }
                    break;
                }
            }
        }
        return this.currentGrid;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.currentGrid = currentGrid;

        this.walkingPath.push(currentStartPoint);
        this.cursor = currentStartPoint;
        this.buildWalls(currentStartPoint, 0);
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: StatRecord[]
    ): void {
        this.currentGrid = newGrid;
        this.cursor = deserializedState.cursor;
        this.walkingPath = deserializedState.walkingPath;
        this.visitedNodes = deserializedState.visitedNodes;
        this.backtrack = deserializedState.backtrack;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: StatRecord[]): void {
        const cursor = serializedState.cursor;
        const walkingPath: GridLocation[] = [];
        serializedState.walkingPath.forEach((item) => {
            const tempWalkingPath = new GridLocation(item.x, item.y, item.weight);
            walkingPath.push(tempWalkingPath);
        });
        const visitedNodes = new HashSet<GridLocation>();
        serializedState.visitedNodes.forEach((item) => {
            const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
            visitedNodes.add(tempGridLocation);
        });
        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            walkingPath: walkingPath,
            visitedNodes: visitedNodes,
            backtrack: serializedState.backtrack
        };
        this.updateAlgorithmState(newGrid, deserializedState, statRecords);
    }

    public getSerializedState(): Object {
        const serializedState = {
            cursor: this.cursor.toObject(),
            walkingPath: [],
            visitedNodes: [],
            backtrack: this.backtrack
        };
        this.walkingPath.forEach((gridLocation) => {
            serializedState.walkingPath.push(gridLocation.toObject());
        });
        this.visitedNodes.forEach((gridLocation) => {
            serializedState.visitedNodes.push(gridLocation.toObject());
        });

        return serializedState;
    }

    public getCurrentAlgorithmState(): Object {
        return {
            walkingPath: this.walkingPath,
            cursor: this.cursor
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Recursive-Backtracking';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
