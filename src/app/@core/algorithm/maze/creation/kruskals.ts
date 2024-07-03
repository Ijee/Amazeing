import { MazeAlgorithm, Node, Statistic } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { shuffleFisherYates } from '../../../../@shared/utils/fisher-yates';

export class Kruskals extends MazeAlgorithmAbstract {
    private edges: HashSet<GridLocation>;
    private sets: HashSet<GridLocation>[];
    // for visualization.
    private shouldMerge: {
        set1Index: number;
        loc1: GridLocation;
        set2Index: number;
        loc2: GridLocation;
    } | null;
    private cleanup: boolean;
    constructor() {
        super(
            [],
            [
                {
                    name: 'Set',
                    type: 'status-5'
                },
                {
                    name: 'Set 1 Merge',
                    type: 'status-4'
                },
                {
                    name: 'Set 2 Merge',
                    type: 'status-7'
                }
            ],
            {
                controls: []
            }
        );
        this.edges = new HashSet<GridLocation>();
        this.sets = [];
        this.cleanup = false;
    }

    /**
     * Returns a GridLocation with the lowest weight.
     * When there's more than one with the same weight we return
     * on randomly from that.
     *
     * @private
     */
    private getRandomLowestWeightLoc(): GridLocation {
        let lowestWeightList: GridLocation[] = [];
        this.edges.forEach((loc) => {
            if (lowestWeightList.length === 0) {
                lowestWeightList.push(loc);
            } else if (loc.weight < lowestWeightList[lowestWeightList.length - 1].weight) {
                lowestWeightList = [];
                lowestWeightList.push(loc);
            } else if (loc.weight === lowestWeightList[lowestWeightList.length - 1].weight) {
                lowestWeightList.push(loc);
            }
        });
        // select one item from the lowest weighted items randomly
        return lowestWeightList[Math.floor(Math.random() * lowestWeightList.length)];
    }

    /**
     * Finds and prepares the grid so the next iteration can actually merge
     * both sets.
     *
     * @private
     */
    private findSet(): void {
        let setFound = false;
        while (!setFound && this.edges.size() > 0) {
            const selectedLoc = this.getRandomLowestWeightLoc();
            const neighbours = shuffleFisherYates(this.getNeighbours(selectedLoc, 2));
            let viableNeighbour: GridLocation;
            let set1Index: number;
            let set2Index: number;
            for (let i = 0; i < neighbours.length; i++) {
                for (let j = 0; j < this.sets.length; j++) {
                    if (this.sets[j].contains(selectedLoc)) {
                        set1Index = j;
                    }
                    if (this.sets[j].contains(neighbours[i])) {
                        set2Index = j;
                        viableNeighbour = neighbours[i];
                    }
                }
            }
            if (set1Index !== set2Index) {
                setFound = true;
                this.sets[set1Index].forEach((loc) => {
                    this.paintNode(loc.x, loc.y, 4);
                });
                this.sets[set2Index].forEach((loc) => {
                    this.paintNode(loc.x, loc.y, 7);
                });
                this.shouldMerge = {
                    set1Index: set1Index,
                    loc1: selectedLoc,
                    set2Index: set2Index,
                    loc2: viableNeighbour
                };
                // Add the node between the other two,
                // so we can easily paint it when merging.
                const x = Math.floor((selectedLoc.x + viableNeighbour.x) / 2);
                const y = Math.floor((selectedLoc.y + viableNeighbour.y) / 2);
                this.sets[set1Index].add(new GridLocation(x, y));
                // so it's easier to see where the connection will be.
                this.paintNode(x, y, 9);
                this.buildWalls(selectedLoc, 0);
                this.buildWalls(viableNeighbour, 0);
            } else {
                this.edges.remove(selectedLoc);
            }
        }
    }

    public nextStep(): Node[][] {
        if (this.edges.size() > 0) {
            // paint both sets the same color when merging.
            // just for visual clarity.
            if (this.shouldMerge && !this.cleanup) {
                this.sets[this.shouldMerge.set2Index].forEach((loc) => {
                    this.sets[this.shouldMerge.set1Index].add(loc);
                    // TODO update other algorithms with this method to make it cleaner.
                    this.paintNode(loc.x, loc.y, 4);
                });
                this.buildWalls(this.shouldMerge.loc1, 0);
                this.buildWalls(this.shouldMerge.loc2, 0);
                this.buildPath(this.shouldMerge.loc1, this.shouldMerge.loc2, 9);
                this.cleanup = true;
            }
            if (this.cleanup) {
                this.sets[this.shouldMerge.set1Index].forEach((loc) => {
                    this.paintNode(loc.x, loc.y, 5);
                });
                this.sets[this.shouldMerge.set2Index].forEach((loc) => {
                    this.paintNode(loc.x, loc.y, 5);
                });
                this.sets.splice(this.shouldMerge.set2Index, 1);
                this.shouldMerge = null;
                this.cleanup = false;
            }
            this.findSet();
            return this.grid;
        } else {
            return null;
        }
    }
    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        const xParity = this.grid.length % 2;
        const yParity = this.grid[0].length % 2;
        for (let i = xParity; i < grid.length; i += 2) {
            for (let j = yParity; j < grid[0].length; j += 2) {
                this.edges.add(new GridLocation(i, j, this.grid[i][j].weight));
                const newSet = new HashSet<GridLocation>();
                newSet.add(new GridLocation(i, j));
                this.sets.push(newSet);
            }
        }
    }
    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.edges = deserializedState.edges;
        this.sets = deserializedState.sets;
        this.shouldMerge = deserializedState.shouldMerge;
        this.cleanup = deserializedState.cleanup;
    }
    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const tempEdges = new HashSet<GridLocation>();
        serializedState.edges.forEach((item) => {
            const edge = new GridLocation(item.x, item.y);
            tempEdges.add(edge);
        });
        const tempSets: HashSet<GridLocation>[] = [];
        serializedState.sets.forEach((set) => {
            const tempSet = new HashSet<GridLocation>();
            set.forEach((item) => {
                const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
                tempSet.add(tempGridLocation);
            });
            tempSets.push(tempSet);
        });

        const deserializedState = {
            edges: tempEdges,
            sets: tempSets,
            shouldMerge: serializedState.shouldMerge,
            cleanup: serializedState.cleanup
        };

        this.updateState(newGrid, deserializedState, statRecords);
    }
    public serialize(): Object {
        const serializedState = {
            edges: [],
            sets: [],
            shouldMerge: this.shouldMerge,
            cleanup: this.cleanup
        };
        this.edges.forEach((loc) => {
            serializedState.edges.push(loc.toObject());
        });
        for (let i = 0; i < this.sets.length; i++) {
            let serialSet = [];
            this.sets[i].forEach((val) => {
                serialSet.push(val.toObject());
            });
            serializedState.sets.push(serialSet);
        }
        return serializedState;
    }
    public getState(): Object {
        return {
            edges: this.edges,
            sets: this.sets,
            shouldMerge: this.shouldMerge,
            cleanup: this.cleanup
        };
    }
    public getAlgorithmName(): MazeAlgorithm {
        return 'Kruskals';
    }
    public usesNodeWeights(): boolean {
        return true;
    }
}
