import { GridLocation } from './GridLocation';

export class PriorityQueue {
    private elements: { priority: number; node: GridLocation }[] = [];

    isEmpty(): boolean {
        return this.elements.length === 0;
    }

    enqueue(node: GridLocation, priority: number): void {
        this.elements.push({ priority, node });
        this.elements.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): GridLocation | undefined {
        return this.elements.shift()?.node;
    }

    empty(): void {
        this.elements = [];
    }

    update(node: GridLocation, newPriority: number): void {
        const index = this.elements.findIndex((element) => element.node.equals(node));
        if (index !== -1) {
            this.elements.splice(index, 1);
        }
        this.enqueue(node, newPriority);
    }

    toObject(): Object {
        const obj = [];
        this.elements.forEach((ele) => {
            obj.push({ priority: ele.priority, node: ele.node.toObject() });
        });

        return obj;
    }
}
