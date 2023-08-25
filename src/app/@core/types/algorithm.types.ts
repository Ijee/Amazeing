import { AlgorithmOptions } from './jsonform.types';
import { GridLocation } from '../../@shared/classes/GridLocation';

export type Node = {
    status: number;
    weight: number;
};
export type StatRecord = {
    name: string;
    type: string;
    currentValue?: number;
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
export type Parity = 'odd' | 'even';
export type NodeCollection = [{ gridLocation: GridLocation; direction: Direction }];

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
    | 'Cellular-Automation'
    | 'Wall-Follower'
    | 'Pledge'
    | 'Trémaux'
    | 'Recursive'
    | 'Dead-End-Filling'
    | 'Maze-Routing';
export type PathFindingAlgorithm =
    | 'A-Star'
    | 'IDA-Star'
    | 'Dijkstra'
    | 'Breadth-FS'
    | 'Depth-FS'
    | 'Best-FS'
    | 'Trace'
    | 'Jump-PS'
    | 'Orthogonal-Jump-PS';

export type PathFindingHeuristic = 'Manhattan' | 'Euclidean' | 'Octile' | 'Chebyshev';
export type Session = {
    algorithm: MazeAlgorithm | PathFindingAlgorithm;
    algorithmMode: AlgorithmMode;
    heuristic?: PathFindingHeuristic;
    state: any;
    iteration: number;
    stats: StatRecord[];
    options: AlgorithmOptions;
    grid: Node[][];
};
