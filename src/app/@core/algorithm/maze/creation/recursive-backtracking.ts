import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

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
            }
        );
        this.walkingPath = [];
        this.visitedNodes = new HashSet<GridLocation>();
        this.backtrack = false;
    }

    public nextStep(): Node[][] {
        if (this.backtrack) {
            if (this.walkingPath.length >= 2) {
                // paint the grid back
                this.grid[this.cursor.x][this.cursor.y].status = 0;
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
            const previousLocation = this.walkingPath[this.walkingPath.length - 1];
            // see if there are valid neighbours so we can build again
            for (let i = 0; i < backtrackNeighbours.length - 1; i++) {
                const node = backtrackNeighbours[i];
                if (!this.visitedNodes.contains(node) && this.grid[node.x][node.y].status === 0) {
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
            this.statRecords[1].currentValue = 0;
            let neighbours = this.getNeighbours(this.cursor, 2);
            neighbours = shuffleFisherYates(neighbours);
            this.backtrack = true;
            for (let i = 0; i < neighbours.length; i++) {
                const node = neighbours[i];
                if (!this.visitedNodes.contains(node) && this.grid[node.x][node.y].status === 0) {
                    // this.buildWalls(this.cursor, 0);
                    this.buildWalls(node, 0);
                    this.buildPath(this.cursor, node, 5);
                    this.cursor = node;
                    this.walkingPath.push(node);
                    this.backtrack = false;

                    if (
                        this.grid[this.cursor.x][this.cursor.y].status !== 2 &&
                        this.grid[this.cursor.x][this.cursor.y].status !== 3
                    ) {
                        this.grid[node.x][node.y].status = 5;
                        this.grid[this.cursor.x][this.cursor.y].status = 5;
                    }
                    break;
                }
            }
        }
        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.walkingPath.push(startLocation);
        this.cursor = startLocation;
        this.buildWalls(startLocation, 0);
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.cursor = deserializedState.cursor;
        this.walkingPath = deserializedState.walkingPath;
        this.visitedNodes = deserializedState.visitedNodes;
        this.backtrack = deserializedState.backtrack;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
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
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
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

    public getState(): object {
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
