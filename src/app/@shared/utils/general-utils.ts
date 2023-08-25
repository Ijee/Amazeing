import { Parity } from '../../@core/types/algorithm.types';

// General util functions used anywhere in the app.

// TODO maybe use the other function
export function getRandomNumber(min: number, max: number, step: number) {
    return Math.floor(Math.random() * ((max - min) / step + 1)) * step + min;
}

/**
 * Returns a random odd or even integer with options.
 * @param min the minimum number
 * @param max the maximum number
 * @param parity whether it should be odd or even
 * @param exclude the number to exclude
 */
export function getRandomIntInclusive(
    min: number,
    max: number,
    parity: Parity,
    exclude?: number
): number {
    min = Math.ceil(min);
    max = Math.floor(max) - 1;
    let num = Math.floor(Math.random() * (max - min + 1)) + min;
    let counter = 0;
    while (counter < 3 && exclude !== undefined && num === exclude) {
        counter += 1;
        num = Math.floor(Math.random() * (max - min + 1)) + min;
    }
    if (parity === 'odd') {
        return num % 2 === 0 ? num + 1 : num;
    } else {
        return num % 2 === 0 ? num : num + 1;
    }
}
