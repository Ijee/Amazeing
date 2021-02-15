export type Node = {
  nodeStatus: number;
};

export type SavePointStats = {
  tick: number;
  cellsAlive: number;
  cellsCreated: number;
};

export type GridLocation = {
  x: number;
  y: number;
};
