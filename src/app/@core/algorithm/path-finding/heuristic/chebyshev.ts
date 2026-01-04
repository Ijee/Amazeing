import { GridLocation } from 'src/app/@core/algorithm/classes/GridLocation';

/**
 * Calculates the Chevyshev-Distance of two given GridLocations on the grid.
 * @param loc1 the first location
 * @param loc2 the second location
 * @returns the euclidean distance
 */
export function chebyshevDistance(loc1: GridLocation, loc2: GridLocation): number {
    const dx = Math.abs(loc1.x - loc2.x);
    const dy = Math.abs(loc1.y - loc2.y);
    return Math.max(dx, dy);
}
