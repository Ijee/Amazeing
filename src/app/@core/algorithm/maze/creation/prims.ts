import { MazeAlgorithmAbstract } from '../maze-algorithm.abstract';
import { HashSet } from '../../../../@shared/classes/HashSet';
import { GridLocation } from '../../../../@shared/classes/GridLocation';
import { MazeAlgorithm, Node, Statistic } from '../../../types/algorithm.types';

export class Prims extends MazeAlgorithmAbstract {
    private frontierNodes: HashSet<GridLocation>;

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
            },
            {}
        );

        this.frontierNodes = new HashSet<GridLocation>();
    }

    private addFrontier(xAxis: number, yAxis: number): void {
        if (
            xAxis >= 0 &&
            yAxis >= 0 &&
            xAxis < this.currentGrid.length &&
            yAxis < this.currentGrid[0].length
        ) {
            const node = this.currentGrid[xAxis][yAxis];
            const status = node.status;
            if (status === 0) {
                this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
                this.currentGrid[xAxis][yAxis].status = 4;
            } else if (status === 3) {
                this.frontierNodes.add(new GridLocation(xAxis, yAxis, node.weight));
            }
        }
    }

    private mark(xAxis: number, yAxis: number): void {
        const node = this.currentGrid[xAxis][yAxis];
        if (node.status === 4) {
            // TODO 5 -> in
            node.status = 5;
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
                const status = this.currentGrid[neighbour.x][neighbour.y].status;
                // So that we can build a path between the randomLowestWeightFrontier and the randomNeighbour
                if (status === 2 || status === 3 || status === 5) {
                    return neighbour;
                }
            });

            const randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
            this.buildPath(selectedFrontierItem, randomNeighbour, 5);
            this.mark(selectedFrontierItem.x, selectedFrontierItem.y);

            // For the stats to show correctly.
            this.statRecords[0].currentValue = this.frontierNodes.size();
            return this.currentGrid;
        }
        return null;
    }

    public setInitialData(currentGrid: Node[][], currentStartPoint: GridLocation): void {
        this.frontierNodes.clear();
        this.currentGrid = currentGrid;
        this.buildWalls(currentStartPoint, 0);
        this.mark(currentStartPoint.x, currentStartPoint.y);
    }

    public updateAlgorithmState(
        newGrid: Node[][],
        deserializedState: any,
        statRecords: Statistic[]
    ): void {
        this.currentGrid = newGrid;
        this.statRecords = statRecords;
        this.frontierNodes = deserializedState.frontierNodes;
    }

    public deserialize(newGrid: Node[][], serializedState: any, statRecords: Statistic[]): void {
        const tempFrontierNodes = new HashSet<GridLocation>();
        serializedState.gridLocations.forEach((item) => {
            const tempGridLocation = new GridLocation(item.x, item.y, item.weight);
            tempFrontierNodes.add(tempGridLocation);
        });
        const deserializedState = {
            frontierNodes: tempFrontierNodes
        };
        this.updateAlgorithmState(newGrid, deserializedState, statRecords);
    }

    public getSerializedState(): Object {
        const serializedState = {
            gridLocations: []
        };
        this.frontierNodes.forEach((gridLocation) => {
            serializedState.gridLocations.push(gridLocation.toObject());
        });
        return serializedState;
    }

    public getCurrentAlgorithmState(): Object {
        return {
            frontierNodes: this.frontierNodes
        };
    }

    public getAlgorithmName(): MazeAlgorithm {
        return 'Prims';
    }

    public usesNodeWeights(): boolean {
        return true;
    }
}
