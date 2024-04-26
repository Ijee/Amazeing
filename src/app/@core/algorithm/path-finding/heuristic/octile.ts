import { GridLocation } from 'src/app/@shared/classes/GridLocation';

/**
 * Calculates the Octile-Distance of two given GridLocations on the grid.
 * @param loc1 the first location
 * @param loc2 the second location
 * @returns the octile distance
 */
export function octileDistance(loc1: GridLocation, loc2: GridLocation): number {
    const dx = Math.abs(loc1.x - loc2.x);
    const dy = Math.abs(loc1.y - loc2.y);
    const F = Math.SQRT2 - 1;
    return dx < dy ? F * dx + dy : F * dy + dx;
}
