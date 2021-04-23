export type Node = {
  status: number;
  weight: number;
};

export type StatRecord = {
  name: string,
  type: string,
  currentValue?: number,
};


export type AlgorithmMode = 'maze' | 'path-finding';

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

export type PathFindingHeuristic =
  'Manhattan'
  | 'Euclidean'
  | 'Octile'
  | 'Chebyshev';


export type Session = {
  algorithm: MazeAlgorithm | PathFindingAlgorithm,
  algorithmMode: AlgorithmMode,
  heuristic?: PathFindingHeuristic,
  state: any,
  iteration: number,
  stats: StatRecord[],
  grid: Node[][],
};
