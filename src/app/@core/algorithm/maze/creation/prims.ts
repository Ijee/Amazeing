import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { GridLocation } from '../../../../@shared/classes/GridLocation';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class Prims extends MazeAlgorithmAbstract {
    private frontierNodes: HashSet<GridLocation>;
    private goalWasFrontier: boolean;
    private goalIsInMaze: boolean;

    constructor() {
        super(
            [],
            [
                {
                    name: 'Frontier Nodes',
                    type: 'status-4',
                    currentValue: 0
                },
                {
                    name: 'In',
                    type: 'status-5'
                }
            ],
            {
                controls: []
            }
        );

        this.frontierNodes = new HashSet<GridLocation>();
    }

    private addFrontier(xAxis: number, yAxis: number): void {
        if (xAxis >= 0 && yAxis >= 0 && xAxis < this.grid.length && yAxis < this.grid[0].length) {
            const node = this.grid[xAxis][yAxis];
            const status = node.status;
            if (status === 0) {
                this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
                this.grid[xAxis][yAxis].status = 4;
            } else if (status === 3 && !this.goalWasFrontier) {
                this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
                this.goalWasFrontier = true;
            }
        }
    }

    private mark(xAxis: number, yAxis: number): void {
        const node = this.grid[xAxis][yAxis];
        if (node.status === 4) {
            node.status = 5;
        } else if (node.status === 3) {
            this.goalIsInMaze = true;
        }
        // marks neighbours as frontierNodes
        this.addFrontier(xAxis - 2, yAxis);
        this.addFrontier(xAxis + 2, yAxis);
        this.addFrontier(xAxis, yAxis - 2);
        this.addFrontier(xAxis, yAxis + 2);
    }

    private getRandomLowestWeightFrontier(): GridLocation {
        let lowestWeightFrontiers: GridLocation[] = [];
        this.frontierNodes.forEach((item) => {
            if (lowestWeightFrontiers.length === 0) {
                lowestWeightFrontiers.push(item);
            } else if (
                item.weight < lowestWeightFrontiers[lowestWeightFrontiers.length - 1].weight
            ) {
                lowestWeightFrontiers = [];
                lowestWeightFrontiers.push(item);
            } else if (
                item.weight === lowestWeightFrontiers[lowestWeightFrontiers.length - 1].weight
            ) {
                lowestWeightFrontiers.push(item);
            }
        });
        // select one item from the lowest weighted items randomly
        return lowestWeightFrontiers[Math.floor(Math.random() * lowestWeightFrontiers.length)];
    }

    public nextStep(): Node[][] | null {
        if (this.frontierNodes.size() !== 0) {
            // const randomFrontierItem = this.frontierNodes.getRandomItem();
            const selectedFrontierItem = this.getRandomLowestWeightFrontier();
            this.frontierNodes.remove(selectedFrontierItem);
            this.buildWalls(selectedFrontierItem, 0);
            const neighbours = this.getNeighbours(selectedFrontierItem, 2).filter((neighbour) => {
                const status = this.grid[neighbour.x][neighbour.y].status;
                // So that we can build a path between the randomLowestWeightFrontier and the randomNeighbour
                return status === 2 || (status === 3 && this.goalIsInMaze) || status === 5;
            });

            const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            this.buildPath(selectedFrontierItem, randomNeighbour, 5);
            this.mark(selectedFrontierItem.x, selectedFrontierItem.y);

            // For the stats to show correctly.
            this.statRecords[0].currentValue = this.frontierNodes.size();
            return this.grid;
        }
        return null;
    }

    public setInitialData(grid: Node[][], startLocation: GridLocation): void {
        this.frontierNodes.clear();
        this.grid = grid;
        this.buildWalls(startLocation, 0);
        this.mark(startLocation.x, startLocation.y);
    }

    public updateState(newGrid: Node[][], deserializedState: any, statRecords: Statistic[]): void {
        this.grid = newGrid;
        this.statRecords = statRecords;
        this.frontierNodes = deserializedState.frontierNodes;
        this.goalIsInMaze = deserializedState.goalIsInMaze;
        this.goalWasFrontier = deserializedState.goalWasFrontier;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const tempFrontierNodes = new HashSet<GridLocation>();
        serializedState.gridLocations.forEach((item) => {
            const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
            tempFrontierNodes.add(tempGridLocation);
        });
        const deserializedState = {
            frontierNodes: tempFrontierNodes,
            goalIsInMaze: serializedState.goalIsInMaze,
            goalWasFrontier: serializedState.goalWasFrontier
        };
        this.updateState(newGrid, deserializedState, statRecords);
    }

    public serialize(): Object {
        const serializedState = {
            gridLocations: [],
            goalIsInMaze: this.goalIsInMaze,
            goalWasFrontier: this.goalWasFrontier
        };
        this.frontierNodes.forEach((gridLocation) => {
            serializedState.gridLocations.push(gridLocation.toObject());
        });
        return serializedState;
    }

    public getState(): Object {
        return {
            frontierNodes: this.frontierNodes,
            goalIsInMaze: this.goalIsInMaze,
            goalWasFrontier: this.goalWasFrontier
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Prims';
    }

    public usesNodeWeights(): boolean {
        return true;
    }
}
