export type AlgoStatNames = {
  algoStatName1?: string,
  algoStatName2?: string,
  algoStatName3?: string,
};

export type Node = {
  nodeStatus: number;
  nodeWeight: number;
};

export type StatRecord = {
  algoStat1: number;
  algoStat2: number;
  algoStat3: number;
};

export type MazeAlgorithm =
  'Prims'
  | 'Kruskals'
  | 'Aldous-Broder'
  | 'Wilsons'
  | 'Ellers'
  | 'Sidewinder'
  | 'Hunt-and-Kill'
  | 'Growing-Tree'
  | 'Binary-Tree'
  | 'Recursive-Backtracker'
  | 'Recursive-Division'
  | 'Cellular-Automation'
  | 'Wall-Follower'
  | 'Pledge'
  | 'Trémaux'
  | 'Recursive'
  | 'Dead-End-Filling'
  | 'Maze-Routing';


export type PathFindingAlgorithm =
  'A-Star'
  | 'IDA-Star'
  | 'Dijkstra'
  | 'Breadth-FS'
  | 'Depth-FS'
  | 'Best-FS'
  | 'Trace'
  | 'Jump-PS'
  | 'Orthogonal-Jump-PS';

export type PathFindingHeuristics =
  'Manhattan'
  | 'Euclidean'
  | 'Octile'
  | 'Chebyshev';
