import {EqualsHashCode} from './EqualsHashCode';

export class GridLocation implements EqualsHashCode  {
  constructor(public x: number, public y: number, public weight: number) {}

  equals(obj: any): boolean {
    if (obj instanceof GridLocation) {
      return obj.x === this.x && obj.y === this.y;
    }
    return false;
  }

  hashCode(): number {
    return this.weight;
  }
}
