import { GridLocation } from 'src/app/@shared/classes/GridLocation';
import { Node, Statistic, PathFindingAlgorithm } from '../../types/algorithm.types';
import { PathFindingAlgorithmAbstract } from './path-finding-algorithm.abstract';
import { HashSet } from 'src/app/@shared/classes/HashSet';

interface PathInformation {
    g: number;
    f: number;
    node: GridLocation;
    predecessor?: PathInformation;
}

export class IDAStar extends PathFindingAlgorithmAbstract {
    private currentPath: PathInformation;
    private basePath: PathInformation;
    private found: boolean;
    private pathSet: HashSet<GridLocation>;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Threshold',
                    type: 'status-none',
                    currentValue: 0
                },
                {
                    name: 'New minimum candidates',
                    type: 'status-4'
                },
                {
                    name: 'Nodes within threshold',
                    type: 'status-5'
                },
                {
                    name:
                        'Note: the grid will not show all the possible ' +
                        'nodes within the last threshold because it stops once it finds the goal. ' +
                        '¯\\_(ツ)_/¯',
                    type: 'status-5'
                },
                {
                    name: 'Path to new minimum node for the next threshold.',
                    type: 'status-6'
                },
                {
                    name: 'First path found.',
                    type: 'status-8'
                }
            ],
            {
                controls: []
            }
        );
        this.pathSet = new HashSet<GridLocation>();
    }
    private paintPath(reset?: true): void {
        let curr = this.currentPath;
        while (curr) {
            const node = curr.node;
            if (reset) {
                this.paintNode(node, 0);
            } else if (this.found) {
                this.paintNode(node, 8);
            } else {
                this.paintNode(node, 6);
            }
            curr = curr.predecessor;
        }
    }

    private search(path: PathInformation, bound: number): PathInformation {
        const node = path.node;

        if (path.f > bound) {
            // So we also highlight the potential new min nodes.
            if (path.node.status !== 5) {
                this.paintNode(node, 4);
            }
            return path;
        }
        this.paintNode(node, 5);

        if (node.status === 3) {
            this.found = true;
            return path;
        }
        let curr = path;
        while (curr) {
            this.pathSet.add(curr.node);
            curr = curr.predecessor;
        }

        const neighbours = this.getNeighbours(node, 1).filter((neighbour) => {
            return neighbour.status !== 1 && !this.pathSet.contains(neighbour);
        });
        this.pathSet.clear();
        let minPath: PathInformation;
        for (const neighbour of neighbours) {
            const g = path.g + neighbour.weight;
            const f = g + this.calculateHeuristic(neighbour);

            const newPath = this.search(
                {
                    g: g,
                    f: f,
                    node: neighbour,
                    predecessor: path
                },
                bound
            );
            if (this.found) {
                return newPath;
            }
            if (!minPath || newPath?.f < minPath.f) {
                minPath = newPath;
            }
        }
        return minPath;
    }

    public nextStep(): Node[][] {
        if (this.found) {
            return null;
            // if (this.currentPath) {
            //     while (this.currentPath) {
            //         const curr = this.currentPath;
            //         this.paintNode(curr.node, 8);
            //         this.currentPath = curr.predecessor;
            //     }
            // } else {
            //     return null;
            // }
            // return this.grid;
        }
        this.paintPath(true);
        const res = this.search(this.basePath, this.currentPath?.f || this.basePath.f);
        if (!res) {
            return null;
        }
        res.f = Math.ceil(res.f);
        this.currentPath = res;
        this.statRecords[0].currentValue = res.f;
        this.paintPath();

        return this.grid;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.grid = grid;
        const bound = this.calculateHeuristic(startLocation);
        this.basePath = {
            node: startLocation,
            g: 0,
            f: bound
        };
        this.statRecords[0].currentValue = bound;
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;

        this.currentPath = deserializedState.currentPath;
        this.basePath = deserializedState.basePath;
        this.found = deserializedState.found;
        this.pathSet = deserializedState.pathSet;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const fromObject = (obj: any): PathInformation => {
            const node = new GridLocation(obj.node.x, obj.node.y, obj.node.weight, obj.node.status);
            const predecessor = obj.predecessor ? fromObject(obj.predecessor) : undefined;
            return {
                g: obj.g,
                f: obj.f,
                node,
                predecessor
            };
        };

        const deserializedState = {
            currentPath: fromObject(serializedState.currentPath),
            basePath: fromObject(serializedState.basePath),
            found: this.found,
            pathSet: new HashSet<GridLocation>()
        };

        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): object {
        const toPathObject = (pathInfo: PathInformation): object => {
            return {
                g: pathInfo.g,
                f: pathInfo.f,
                node: pathInfo.node.toObject(),
                predecessor: pathInfo.predecessor ? toPathObject(pathInfo.predecessor) : undefined
            };
        };

        const serializedState = {
            currentPath: toPathObject(this.currentPath),
            basePath: toPathObject(this.basePath),
            found: this.found
        };

        return serializedState;
    }

    public getState(): object {
        return {
            currentPath: this.currentPath,
            basePath: this.basePath,
            found: this.found,
            pathSet: this.pathSet
        };
    }

    public getAlgorithmName(): PathFindingAlgorithm {
        return 'IDA-Star';
    }

    public usesNodeWeights(): boolean {
        return true;
    }

    public usesHeuristics(): boolean {
        return true;
    }

    public usesPathFindingSettings(): boolean {
        return true;
    }

    public forcesDiagonalMovement(): boolean {
        return false;
    }
}
