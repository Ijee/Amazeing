import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class Wilsons extends MazeAlgorithmAbstract {
    private gridWith: number;
    private gridHeight: number;
    private cursor: GridLocation;
    private unusedNodes: HashSet<GridLocation>;
    private walkingPath: GridLocation[];

    private isWalking: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Cursor',
                    type: 'status-4'
                },
                {
                    name: 'Remaining Nodes',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'Walking Distance',
                    type: 'status-5',
                    currentValue: 0
                }
            ],
            {
                controls: [
                    {
                        name: 'Node Choice',
                        label: 'Node Choice',
                        value: 'choose random node',
                        values: ['choose random node', 'sequential node selection'],
                        type: 'radio',
                        validators: {
                            required: true
                        }
                    }
                ]
            }
        );
        this.cursor = null;
        this.unusedNodes = new HashSet<GridLocation>();
        this.walkingPath = [];
        this.isWalking = false;
    }

    private randomWalk(): void {
        let neighbours: GridLocation[] = this.getNeighbours(this.cursor, 2);
        // shuffling because otherwise the random walk would just be a straight line.
        neighbours = shuffleFisherYates(neighbours);
        neighbours.every((neighbour) => {
            // so we don't paint over walls, start and goal.
            // this.currentGrid[neighbour.x][neighbour.y].status !== 2 &&
            if (this.grid[neighbour.x][neighbour.y].status !== 1) {
                if (
                    this.grid[neighbour.x][neighbour.y].status !== 2 &&
                    this.grid[neighbour.x][neighbour.y].status !== 3 &&
                    this.grid[neighbour.x][neighbour.y].status !== 5
                ) {
                    this.grid[neighbour.x][neighbour.y].status = 8;
                    this.grid[this.cursor.x][this.cursor.y].status = 8;
                }

                this.buildPath(this.cursor, neighbour, 8);
                this.cursor = neighbour;
                return false;
            }
        });

        // remove loops
        let eraseLoop = false;
        let newWalkingPath: GridLocation[] = [];
        for (let i = 0; i < this.walkingPath.length; i++) {
            let node = this.walkingPath[i];
            if (
                eraseLoop &&
                this.grid[node.x][node.y].status !== 1 &&
                this.grid[node.x][node.y].status !== 2 &&
                this.grid[node.x][node.y].status !== 3
            ) {
                this.grid[node.x][node.y].status = 0;
                const lastNode = this.walkingPath[i - 1];
                this.buildPath(this.walkingPath[i], lastNode, 0);
                this.grid[node.x][node.y].status = 0;
                this.grid[lastNode.x][lastNode.y].status = 0;
            } else {
                newWalkingPath.push(this.walkingPath[i]);
            }
            if (this.cursor.equals(node)) {
                eraseLoop = true;
                // removes the last node that would not be colored back to being empty when a loop has been found.
                this.buildPath(this.cursor, this.walkingPath[this.walkingPath.length - 1], 0);
            }
        }
        if (eraseLoop) {
            this.walkingPath = newWalkingPath;
            // otherwise there's more flickering during autoplay because the cursor will often
            // be repainted from empty (0) to 8 and back.
            this.grid[this.cursor.x][this.cursor.y].status = 8;
        } else {
            this.walkingPath.push(this.cursor);
        }
        if (
            this.grid[this.cursor.x][this.cursor.y].status === 5 ||
            this.grid[this.cursor.x][this.cursor.y].status === 2
        ) {
            this.isWalking = false;
        }
        this.statRecords[2].currentValue = this.walkingPath.length;
    }

    public nextStep(): Node[][] | null {
        if (this.unusedNodes.size() > 0) {
            // starting node
            if (this.cursor === null) {
                this.cursor = this.unusedNodes.getRandomItem();
                this.walkingPath.push(this.cursor);
                this.isWalking = true;
                this.grid[this.cursor.x][this.cursor.y].status = 8;
                return this.grid;
            }
            // random walk
            if (this.isWalking) {
                this.randomWalk();
            }
            // building
            else {
                // remove nodes that will be built on from the unusedNodes array.
                const node = this.walkingPath[0];
                for (let i = node.x - 1; i <= node.x + 1; i++) {
                    for (let j = node.y - 1; j <= node.y + 1; j++) {
                        if (this.grid[i]?.[j] !== undefined) {
                            const loc = new GridLocation(i, j, 0);
                            this.unusedNodes.remove(loc);
                        }
                    }
                }
                this.buildWalls(node, 0, 8);
                this.statRecords[1].currentValue = this.unusedNodes.size();
                // paint walkingPaths first node as an 'in node' + the node inbetween.
                if (
                    this.grid[node.x][node.y].status !== 2 &&
                    this.grid[node.x][node.y].status !== 3
                ) {
                    this.grid[node.x][node.y].status = 5;
                }
                if (this.walkingPath[1]) {
                    this.buildPath(node, this.walkingPath[1], 5);
                }
                this.walkingPath.shift();
                if (this.walkingPath.length === 0) {
                    this.cursor = null;
                }
            }

            return this.grid;
        } else {
            return null;
        }
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        this.gridWith = this.grid.length;
        this.gridHeight = this.grid[0].length;
        for (let i = startLocation.x % 2; i < this.gridWith; i += 2) {
            for (let j = startLocation.y % 2; j < this.gridHeight; j += 2) {
                if (
                    this.grid[i][j].status !== 1 &&
                    this.grid[i][j].status !== 2 &&
                    this.grid[i][j].status !== 3
                ) {
                    // weight = 0 because we don't need it anyway for this algorithm.
                    this.unusedNodes.add(new GridLocation(i, j, 0));
                }
            }
        }
        this.statRecords[1].currentValue = this.unusedNodes.size();
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.gridWith = deserializedState.gridWidth;
        this.gridHeight = deserializedState.gridHeight;
        this.cursor = deserializedState.cursor;
        this.unusedNodes = deserializedState.unusedNodes;
        this.walkingPath = deserializedState.walkingPath;
        this.isWalking = deserializedState.isWalking;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const cursor = serializedState.cursor;
        const unusedNodes: HashSet<GridLocation> = new HashSet<GridLocation>();
        serializedState.unusedNodes.forEach((item) => {
            const tempUnusedNodes = new GridLocation(item.x, item.y, item.weight, item.status);
            unusedNodes.add(tempUnusedNodes);
        });
        const walkingPath: GridLocation[] = [];
        serializedState.walkingPath.forEach((item) => {
            const tempWalkingPath = new GridLocation(item.x, item.y, item.weight, item.status);
            walkingPath.push(tempWalkingPath);
        });
        const deserializedState = {
            gridWidth: serializedState.gridWith,
            gridHeight: serializedState.gridHeight,
            cursor: new GridLocation(cursor.x, cursor.y, cursor.weight),
            unusedNodes: unusedNodes,
            walkingPath: walkingPath,
            isWalking: serializedState.isWalking
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            gridWidth: this.gridWith,
            gridHeight: this.gridHeight,
            cursor: this.cursor.toObject(),
            unusedNodes: [],
            walkingPath: [],
            isWalking: this.isWalking
        };
        this.unusedNodes.forEach((gridLocation) => {
            serializedState.unusedNodes.push(gridLocation.toObject());
        });
        this.walkingPath.forEach((gridLocation) => {
            serializedState.walkingPath.push(gridLocation.toObject());
        });
        return serializedState;
    }

    public getState(): Object {
        return {
            gridWidth: this.gridWith,
            gridHeight: this.gridHeight,
            cursor: this.cursor,
            unusedNodes: this.unusedNodes,
            walkingPath: this.walkingPath,
            isWalking: this.isWalking
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Wilsons';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
