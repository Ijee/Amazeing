export type Node = {
  nodeStatus: number;
};

export type SavePointStats = {
  iteration: number;
  nodesAlive: number;
  nodesCreated: number;
};

export type GridLocation = {
  x: number;
  y: number;
};

export type MazeAlgorithms =
  'Prims'
  | 'Kruskals'
  | 'Aldous-Broder'
  | 'Recursive Backtracker'
  | 'Wilsons'
  | 'Ellers'
  | 'Sidewinder'
  | 'Hunt-and-Kill'
  | 'Growing-Tree'
  | 'Binary-Tree'
  | 'Recursive-Backtracker'
  | 'Recursive-Division'
  | 'Cellular-Automation';


export type PathFindingAlgorithms =
  'A-Star'
  | 'IDA-Star'
  | 'Dijkstra'
  | 'Breadth-FS'
  | 'Depth-FS'
  | 'Best-FS'
  | 'Trace'
  | 'Jump-PS'
  | 'Orthogonal-Jump-PS'
