import { Node, Statistic, MazeAlgorithm } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';

export class CellularAutomaton extends MazeAlgorithmAbstract {
    constructor() {
        super([], [], {
            controls: [
                {
                    name: 'Ruleset',
                    label: 'Ruleset',
                    value: 'Mazectric Ruleset (B3/S1234)',
                    values: ['Mazectric Ruleset (B3/S1234)', 'Maze Ruleset (B3/S12345)'],
                    type: 'radio',
                    validators: {
                        required: true
                    }
                }
            ]
        });
    }

    protected override getNeighbours(loc: GridLocation): GridLocation[] {
        const neighbours: GridLocation[] = [];
        // Directions for 8 neighbors: N, S, E, W, NE, NW, SE, SW
        const directions: [number, number][] = [
            [-1, 0],
            [1, 0],
            [0, 1],
            [0, -1],
            [-1, 1],
            [-1, -1],
            [1, 1],
            [1, -1]
        ];

        const rows: number = this.grid.length;
        const cols: number = this.grid[0].length;

        for (const [dx, dy] of directions) {
            const newX = loc.x + dx;
            const newY = loc.y + dy;
            if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
                neighbours.push(
                    new GridLocation(newX, newY, undefined, this.grid[newX][newY].status)
                );
            }
        }

        return neighbours;
    }

    /**
     *  Applies the celullar automaton Mazectric ruleset (B3/S1234)
     *
     * @param currentStatus the current status of the cell
     * @param aliveNeighbours the amount of alive cell neighbours
     *
     * @returns 1 if the cell is alive; 0 if it is dead
     */
    private applyMazectricRuleset(currentStatus: number, aliveNeighbours: number): number {
        // Rule nr. 1: A dead cell becomes alive if it has exactly 3 live neighbors.
        if (currentStatus === 0 && aliveNeighbours === 3) {
            return 1;
        }
        // Rule nr. 2: A live cell survives if it has 1, 2, 3, or 4 alive neighbours.
        if (currentStatus === 1 && aliveNeighbours >= 1 && aliveNeighbours <= 4) {
            return 1;
        }
        // In all other cases it becomes or remains dead.
        return 0;
    }

    /**
     *  Applies the Maze ruleset (B3/S12345)
     *
     * @param currentStatus the current status of the cell
     * @param aliveNeighbours the amount of alive cell neighbours
     *
     *  @returns 1 if the cell is alive; 0 if it is dead
     */
    private applyMazeRuleset(currentStatus: number, aliveNeighbours: number): number {
        // Rule nr. 1: A dead cell becomes alive if it has exactly 3 live neighbors.
        if (currentStatus === 0 && aliveNeighbours === 3) {
            return 1;
        }
        // Rule nr. 2: A live cell survives if it has 1, 2, 3, 4, or 5 alive neighbours.
        if (currentStatus === 1 && aliveNeighbours >= 1 && aliveNeighbours <= 5) {
            return 1;
        }
        // In all other cases it becomes or remains dead.
        return 0;
    }

    public nextStep(): Node[][] {
        // So that we do not change the original grid.
        const nodeChanges: GridLocation[] = [];

        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const currentNode = this.grid[i][j];
                const loc = new GridLocation(i, j, undefined, currentNode.status);
                const aliveNeighbors = this.getNeighbours(loc).reduce(
                    (count, neighbor) => count + (neighbor.status === 1 ? 1 : 0),
                    0
                );

                let nextStatus: number;

                if (this.options['Ruleset'] === 'Mazectric Ruleset (B3/S1234)') {
                    nextStatus = this.applyMazectricRuleset(currentNode.status, aliveNeighbors);
                } else {
                    nextStatus = this.applyMazeRuleset(currentNode.status, aliveNeighbors);
                }

                if (currentNode.status !== nextStatus) {
                    nodeChanges.push(new GridLocation(i, j, undefined, nextStatus));
                }
            }
        }

        for (const change of nodeChanges) {
            this.paintNode(change.x, change.y, change.status);
        }

        return this.grid;
    }

    public setInitialData(grid: Node[][]): void {
        this.grid = grid;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        this.updateState(newGrid, {}, statRecords);
    }

    public serialize(): object {
        return {};
    }

    public getState(): object {
        return {};
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Cellular-Automaton';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
}
