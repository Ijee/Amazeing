import { EqualsHashCode } from './EqualsHashCode';

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
        return this.weight;
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
