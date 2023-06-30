import { EqualsHashCode } from './EqualsHashCode';

export class GridLocation implements EqualsHashCode {
    constructor(
        public x: number,
        public y: number,
        public weight?: number,
        public status?: number
    ) {}

    equals(obj: any): boolean {
        if (obj instanceof GridLocation) {
            return obj.x === this.x && obj.y === this.y;
        }
        return false;
    }

    hashCode(): number {
        return this.weight;
    }

    toObject(): object {
        return {
            x: this.x,
            y: this.y,
            weight: this.weight
        };
    }
}
