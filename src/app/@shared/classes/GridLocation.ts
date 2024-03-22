import { EqualsHashCode } from './EqualsHashCode';

/**
 * Represents a node with all available information about it as well as a way
 * to serialize it for the importing/exporting functionality.
 */
export class GridLocation implements EqualsHashCode {
    constructor(
        public readonly x: number,
        public readonly y: number,
        public readonly weight?: number,
        public readonly status?: number
    ) {}

    equals(obj: any): boolean {
        if (obj instanceof GridLocation) {
            return obj.x === this.x && obj.y === this.y;
        }
        return false;
    }

    hashCode(): number {
        // return this.weight;
        return this.x * this.y;
    }

    toObject(): object {
        return {
            x: this.x,
            y: this.y,
            weight: this.weight,
            status: this.status
        };
    }
}
