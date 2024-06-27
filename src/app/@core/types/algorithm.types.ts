import { AlgorithmOptions } from './jsonform.types';
import { GridLocation } from '../../@shared/classes/GridLocation';

export type Node = {
    status: number;
    weight: number;
    text?: string;
};
export type Statistic = {
    name: string;
    type: string;
    currentValue?: number;
};
export type AlgorithmRecord = {
    grid: Node[][];
    state: any;
    statRecord: Statistic[];
};
export type StatusChange = {
    status0?: number;
    status1?: number;
    status2?: number;
    status3?: number;
    status4?: number;
    status5?: number;
    status6?: number;
    status7?: number;
    status8?: number;
    status9?: number;
};

export type Direction = 'unknown' | 'up' | 'right' | 'down' | 'left';
export type Orientation = 'horizontal' | 'vertical';
export type Parity = 'odd' | 'even';
export type NodeDirection = { gridLocation: GridLocation; direction: Direction };
export type VisitedNode = {
    predecessor: GridLocation;
    distance: number;
};

export type AlgorithmMode = 'maze' | 'path-finding';
export type MazeAlgorithm =
    | 'Prims'
    | 'Kruskals'
    | 'Aldous-Broder'
    | 'Wilsons'
    | 'Ellers'
    | 'Sidewinder'
    | 'Hunt-and-Kill'
    | 'Growing-Tree'
    | 'Binary-Tree'
    | 'Recursive-Backtracking'
    | 'Recursive-Division'
    | 'Cellular-Automaton';
export type PathFindingAlgorithm =
    | 'A-Star'
    | 'IDA-Star'
    | 'Dijkstra'
    | 'Breadth-FS'
    | 'Depth-FS'
    | 'Best-FS'
    | 'Jump-PS'
    | 'Orthogonal-Jump-PS'
    | 'Wall-Follower'
    | 'Pledge'
    | 'Trémaux'
    | 'Dead-End-Filling'
    | 'Maze-Routing';

export type PathFindingHeuristic = 'Manhattan' | 'Euclidean' | 'Octile' | 'Chebyshev' | 'None';
export type Session = {
    version: number;
    algorithm: MazeAlgorithm | PathFindingAlgorithm;
    algorithmMode: AlgorithmMode;
    iteration: number;
    state: any;
    stats: Statistic[];
    heuristic?: PathFindingHeuristic;
    options: AlgorithmOptions;
    pathFindingSettings?: {
        diagonalMovement: boolean;
        cornerMovement: boolean;
    };
    grid: Node[][];
    startLoc: GridLocation;
    goalLoc: GridLocation;
};
