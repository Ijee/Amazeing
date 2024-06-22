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
     * @param loc the location to apply the ruleset to
     * @param aliveNeighbours the amount of alive cell neighbours
     */
    private applyMazectricRuleset(loc: GridLocation, aliveNeighbours: number): void {
        // Rule nr. 1: A dead cell becomes alive if it has exactly 3 live neighbors.
        if (this.grid[loc.x][loc.y].status === 0 && aliveNeighbours === 3) {
            this.paintNode(loc.x, loc.y, 1);
        } // Rule nr. 2:  A live cell survives from one generation to the next if they
        //                have at least one and at most four alive neighbours.
        if (this.grid[loc.x][loc.y].status === 1 && aliveNeighbours <= 4) {
            this.paintNode(loc.x, loc.y, 1);
        }
        if (this.grid[loc.x][loc.y].status === 1 && aliveNeighbours > 4) {
            // Rule nr. 3: If it has more than 4 alive neighbour cells it does not surive.
            this.paintNode(loc.x, loc.y, 0);
        }
    }

    /**
     *  Applies the Maze ruleset (B3/S12345)
     *
     * @param loc the location to apply the ruleset to
     * @param aliveNeighbours the amount of alive cell neighbours
     */
    private applyMazeRuleset(loc: GridLocation, aliveNeighbours: number): void {
        // Rule nr. 1: A dead cell becomes alive if it has exactly 3 live neighbors.
        if (this.grid[loc.x][loc.y].status === 0 && aliveNeighbours === 3) {
            this.paintNode(loc.x, loc.y, 1);
        } // Rule nr. 2:  A live cell survives from one generation to the next if they
        //                have at least one and at most five alive neighbours.
        if (this.grid[loc.x][loc.y].status === 1 && aliveNeighbours <= 5) {
            this.paintNode(loc.x, loc.y, 1);
        }
        if (this.grid[loc.x][loc.y].status === 1 && aliveNeighbours > 5) {
            // Rule nr. 3: If it has more than 5 alive neighbour cells it does not surive.
            this.paintNode(loc.x, loc.y, 0);
        }
    }

    public nextStep(): Node[][] {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[0].length; j++) {
                const node = new GridLocation(i, j, undefined, this.grid[i][j].status);
                const aliveNeighbors = this.getNeighbours(node).reduce(
                    (count, neighbor) => count + (neighbor.status === 1 ? 1 : 0),
                    0
                );
                if (this.options['Ruleset'] === 'Mazectric Ruleset (B3/S1234') {
                    this.applyMazectricRuleset(node, aliveNeighbors);
                } else {
                    this.applyMazeRuleset(node, aliveNeighbors);
                }
            }
        }
        return this.grid;
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        this.updateState(newGrid, {}, statRecords);
    }
    public serialize(): Object {
        return {};
    }
    public getState(): Object {
        return {};
    }
    public getAlgorithmName(): MazeAlgorithm {
        return 'Cellular-Automaton';
    }
    public usesNodeWeights(): boolean {
        return false;
    }
}
