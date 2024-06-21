import { MazeAlgorithm, Node, Statistic } from 'src/app/@core/types/algorithm.types';
import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { HashMap } from '../../../../@shared/classes/HasMap';

export class Ellers extends MazeAlgorithmAbstract {
    private cursor: GridLocation;
    private setSize: number;
    private sets: HashMap<GridLocation, HashSet<GridLocation>>;
    private lastColouredSet: HashSet<GridLocation>;
    private setsCreated: boolean;
    private setsMerged: boolean;
    private passagesCreated: HashSet<GridLocation>[]; // Only checks for indizes
    constructor() {
        super([], [], { controls: [] });

        this.lastColouredSet = undefined;
        this.setsCreated = false;
        this.setsMerged = false;
        this.passagesCreated = [];
    }

    /**
     * Merges sets randomly with a pseudo coin flip.
     * @param skipCoinFlip whether it should skip the coin flip
     * @private
     */
    private mergeSets(skipCoinFlip: boolean): void {
        const cursor = this.cursor;
        const next = new GridLocation(cursor.x + 2, cursor.y);
        const set1 = this.sets.get(cursor);
        const set2 = this.sets.get(next);
        if (set1 === set2) {
            return;
        }
        const coinFlip = Math.random() > 0.5;

        if (coinFlip || skipCoinFlip) {
            set2.forEach((loc) => {
                set1.add(loc);
                this.sets.put(loc, set1);
            });
            this.setSize--;
            set1.add(new GridLocation(cursor.x + 1, cursor.y));
            set1.forEach((loc) => {
                this.paintNode(loc, 7);
            });
            this.buildWalls(next, 0);
            this.buildPath(cursor, next, 7);
            this.lastColouredSet = set1;
        } else {
            // not merging.
            // this.buildWalls(cursor, 0);
            // this.lastColouredSet = undefined;
            this.paintNode(cursor, 5);
        }
    }

    /**
     * Builds a vertical passage randomly with a coin flip.
     * @private
     */
    private buildPassage(): void {
        const cursor = this.cursor;
        const lineAbove = cursor.y - 2;
        const above = new GridLocation(cursor.x, lineAbove);
        const set = this.sets.get(above);
        const coinFlip = Math.random() > 0.5;
        const hasPassage = this.passagesCreated.includes(set);
        let lastAbove = new GridLocation(0, 0);

        set.forEach((loc) => {
            if (loc.y === lineAbove && loc.x >= lastAbove.x) {
                lastAbove = loc;
            }
        });
        const mustBuild = lastAbove.equals(above) && !hasPassage;

        if (coinFlip || mustBuild) {
            this.buildWalls(cursor, 0);
            this.buildPath(cursor, above, 5);
            set.add(cursor);
            this.sets.put(cursor, set);
            set.add(new GridLocation(cursor.x, cursor.y - 1));
            if (!hasPassage) {
                this.passagesCreated.push(set);
            }
            set.forEach((loc) => {
                this.paintNode(loc, 7);
            });
            this.lastColouredSet = set;
        }
    }

    public nextStep(): Node[][] {
        // Cleanup (Painting the color back)
        if (this.lastColouredSet) {
            this.lastColouredSet.forEach((loc) => {
                this.paintNode(loc, 5);
            });
            this.lastColouredSet = undefined;
        }
        if (this.setSize === 1) {
            this.setSize = -1;
            return this.grid;
        }
        if (this.setSize === -1) {
            return null;
        }
        if (this.setsCreated) {
            // Merging sets
            if (this.cursor.x < this.grid.length - 2) {
                this.mergeSets(this.cursor.y >= this.grid[0].length - 1);
                this.cursor = new GridLocation(this.cursor.x + 2, this.cursor.y);
            } else {
                this.setsCreated = false;
                this.setsMerged = true;
                this.cursor = new GridLocation(this.cursor.x % 2, this.cursor.y + 2);
                this.passagesCreated = [];
            }
        } else if (this.setsMerged) {
            //Vertical Passages
            if (this.cursor.x < this.grid.length) {
                this.buildPassage();
                this.cursor = new GridLocation(this.cursor.x + 2, this.cursor.y);
            } else {
                this.setsMerged = false;
                this.cursor = new GridLocation(this.cursor.x % 2, this.cursor.y);
            }
        } else {
            // Create new Sets
            for (let i = this.cursor.x % 2; i < this.grid.length; i += 2) {
                const loc = new GridLocation(i, this.cursor.y);
                if (!this.sets.contains(loc)) {
                    this.buildWalls(loc, 0);
                    this.paintNode(loc, 4);
                    const newSet = new HashSet<GridLocation>();
                    newSet.add(loc);
                    this.sets.put(loc, newSet);
                    this.setSize++;
                }
            }
            this.setsCreated = true;
        }

        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;

        this.sets = new HashMap<GridLocation, HashSet<GridLocation>>();
        this.setSize = 0;
        this.cursor = new GridLocation(startLocation.x % 2, 0);
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.cursor = deserializedState.cursor;
        this.setSize = deserializedState.setSize;
        this.sets = deserializedState.sets;
        this.lastColouredSet = deserializedState.lastColouredSet;
        this.setsCreated = deserializedState.setsCreated;
        this.setsMerged = deserializedState.setsMerged;
        this.passagesCreated = deserializedState.passagesCreated;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const cursor = serializedState.cursor;

        const tempPassagesCreated: HashSet<GridLocation>[] = [];
        serializedState.passagesCreated.forEach((set) => {
            const tempSet = new HashSet<GridLocation>();
            set.forEach((item) => {
                const tempGridLocation = new GridLocation(item.x, item.y);
                tempSet.add(tempGridLocation);
            });
            tempPassagesCreated.push(tempSet);
        });
        const tempSets = new HashMap<GridLocation, HashSet<GridLocation>>();

        const deserializedState = {
            cursor: new GridLocation(cursor.x, cursor.y),
            setSize: serializedState.setSize,
            sets: tempSets,
            lastColouredSet: serializedState.lastColouredSet,
            setsCreated: serializedState.setsCreated,
            setsMerged: serializedState.setsMerged,
            passagesCreated: tempPassagesCreated
        };

        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            cursor: this.cursor,
            setSize: this.setSize,
            sets: [],
            lastColouredSet: [],
            setsCreated: this.setsCreated,
            setsMerged: this.setsMerged,
            passagesCreated: []
        };
        const setsObj = [];
        this.sets.forEach((key, value) => {
            let locList = [];
            value.forEach((loc) => {
                locList.push(loc.toObject());
            });
            setsObj.push({ key: key.toObject(), locList: locList });
        });
        serializedState.sets = setsObj;

        for (let i = 0; i < this.lastColouredSet.size(); i++) {
            let serialSet = [];
            this.lastColouredSet[i].forEach((val) => {
                serialSet.push(val.toObject());
            });
            serializedState.lastColouredSet.push(serialSet);
        }

        for (let i = 0; i < this.passagesCreated.length; i++) {
            let serialSet = [];
            this.passagesCreated[i].forEach((val) => {
                serialSet.push(val.toObject());
            });
            serializedState.passagesCreated.push(serialSet);
        }
        console.log(serializedState, 'serialized State');

        return serializedState;
    }

    public getState(): Object {
        return {
            cursor: this.cursor,
            setSize: this.setSize,
            sets: this.sets,
            lastColouredSet: this.lastColouredSet,
            setsCreated: this.setsCreated,
            setsMerged: this.setsMerged,
            passagesCreated: this.passagesCreated
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Ellers';
    }

    public usesNodeWeights(): boolean {
        return false;
    }
}
