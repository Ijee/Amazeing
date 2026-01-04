import { GridLocation } from 'src/app/@core/algorithm/classes/GridLocation';

/**
 * Calculates the Euclidean-Distance of two given GridLocations on the grid.
 * @param loc1 the first location
 * @param loc2 the second location
 * @returns the euclidean distance
 */
export function euclideanDistance(loc1: GridLocation, loc2: GridLocation): number {
    const dx = loc1.x - loc2.x;
    const dy = loc1.y - loc2.y;
    return Math.sqrt(dx * dx + dy * dy);
}
