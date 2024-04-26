import { GridLocation } from 'src/app/@shared/classes/GridLocation';

/**
 * Calculates the Manhattan-Distance of two given GridLocations on the grid.
 * @param loc1 the first location
 * @param loc2 the second location
 * @returns the manhattan distance
 */
export function manhattanDistance(loc1: GridLocation, loc2: GridLocation): number {
    return Math.abs(loc1.x - loc2.x) + Math.abs(loc1.y - loc2.y);
}
