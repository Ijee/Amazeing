import { GridLocation } from '../classes/GridLocation';

/**
 *  Fisher-Yates random sort algorithm
 * @param array - the array to be shuffled
 * @return the shuffled array
 */
export function shuffleFisherYates(array: GridLocation[]): GridLocation[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
