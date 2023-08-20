export function getRandomNumber(min: number, max: number, step: number) {
    return Math.floor(Math.random() * ((max - min) / step + 1)) * step + min;
}
