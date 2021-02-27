import {EqualsHashCode} from './EqualsHashCode';

export class GridLocation implements EqualsHashCode  {
  constructor(public x: number, public y: number) {}

  equals(obj: any): boolean {
    if (obj instanceof GridLocation) {
      return obj.x === this.x && obj.y === this.y;
    }
    return false;
  }

  hashCode(): number {
    return 1337 * this.x + this.y;
  }
}
