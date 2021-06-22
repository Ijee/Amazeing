import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { EqualsHashCode } from './EqualsHashCode';

/**
 * Eine Implementation eines Sets, das auf EqualsHashCode basiert.
 */
export class HashSet<T extends EqualsHashCode> {
    private length: number;

    private members: T[][];
    private currentSize;

    private expanding: Subject<void>;

    constructor(initial?: ArrayLike<T> | HashSet<T>) {
        if (initial) {
            if (initial instanceof HashSet) {
                this.init(initial.length);
                initial.forEach((value) => this.add(value));
            } else {
                this.init(initial.length);
                for (let i = 0; i < this.currentSize; i++) {
                    this.add(initial[i]);
                }
            }
        } else {
            this.init(10);
        }
        this.expanding = new Subject();
        this.expanding
            .pipe(debounceTime(200))
            .subscribe(() => this.expandSize());
    }

    /**
     * Fügt dem Set ein neues Element hinzu, solange es noch nicht in der Map vorhanden ist.
     * @param value das einzufügende Element.
     * @returns true, wenn das Element eingefügt wurde, false, wenn es bereits vorhanden war.
     */
    public add(value: T): boolean {
        if (!this.contains(value)) {
            this.members[value.hashCode() % this.currentSize].push(value);
            this.length++;
            if (this.length > this.currentSize) {
                this.expanding.next();
            }
            return true;
        }
        return false;
    }

    /**
     * Leert das Set, sodass es danach keine Elemente mehr enthält.
     */
    public clear(): void {
        this.init(this.currentSize);
    }

    /**
     * Bestätigt, ob der angegebene Wert bereits im Set vorhanden ist.
     * @param value das Element, auf das geprüft werden soll.
     * @returns true, wenn es im Set vorhanden ist, false sonst.
     */
    public contains(value: T): boolean {
        const list = this.members[value.hashCode() % this.currentSize];
        return list.findIndex((val) => val.equals(value)) >= 0;
    }

    /**
     * Ruft für jedes Element die gegebene Callback-Funktion auf
     * @param callbackfn die angegebene Callback-Funktion, mit dem Parameter:
     * value für das Element.
     */
    public forEach(callbackfn: (value: T) => void): void {
        for (const value of this.flatMembers()) {
            callbackfn(value);
        }
    }

    /**
     * Gibt ein random item aus dem Set zurück.
     */
    public getRandomItem(): T {
        const arr = this.flatMembers();
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Entfernt ein Element aus dem Set.
     * @param value das Element, das entfernt werden soll.
     * @returns true, wenn das Element entfernt wurde, false, wenn das Element nicht vorhanden war.
     */
    public remove(value: T): boolean {
        const list = this.members[value.hashCode() % this.currentSize];
        const i = list.findIndex((val) => val.equals(value));
        if (i >= 0) {
            list.splice(i, 1);
            this.length--;
            return true;
        }
        return false;
    }

    /**
     * Gibt die Anzahl der Elemente im Set zurück.
     * @returns der Füllstand des Sets.
     */
    public size(): number {
        return this.length;
    }

    /**
     * Internes Initialisieren, auch geeignet zum leeren.
     * @param size die (neue) Größe des internen Arrays
     */
    private init(size: number): void {
        size = size < 10 ? 10 : size;
        this.currentSize = size;
        this.members = new Array(size);
        this.length = 0;
        for (let i = 0; i < size; i++) {
            this.members[i] = [];
        }
    }

    /**
     * Interne Methode, die eine Liste aller Einträge des Sets zurückgibt.
     */
    private flatMembers(): T[] {
        return this.members.reduce((all, next) => [...all, ...next], []);
    }

    /**
     * Interne Methode, die das interne Array vergrößert.
     */
    private expandSize(): void {
        const old = this.flatMembers();
        this.init((this.length *= 2));
        old.forEach((val) => this.add(val));
    }
}
