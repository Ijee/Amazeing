import { EqualsHashCode } from './EqualsHashCode';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * Eine Implementation einer Map, die auf EqualsHashCode basiert.
 */
export class HashMap<K extends EqualsHashCode, V> {
    private length: number;

    private members: Entry<K, V>[][];
    private currentSize;

    private expanding: Subject<void>;

    constructor(initial?: HashMap<K, V>) {
        if (initial) {
            this.init(initial.length);
            initial.flatMembers().forEach((val) => this.internalAdd(val));
        } else {
            this.init(10);
        }
        this.expanding = new Subject<void>();
        this.expanding.pipe(debounceTime(200)).subscribe(() => this.expandSize());
    }

    /**
     * Leert die Map, sodass sie danach keine Elemente mehr Enthält.
     */
    public clear(): void {
        this.init(this.currentSize);
    }

    /**
     * Bestätigt, ob die Map den angegebenen Key kennt.
     * @param key der Key, nach dem gesucht werden soll.
     * @returns true, wenn die Map den Key kennt, sonst false.
     */
    public contains(key: K): boolean {
        return this.internalGet(new Entry(key, null)) !== undefined;
    }

    /**
     * Ruft für jedes Key-Value-Paar die gegebene Callback-Funktion auf
     * @param callbackfn die angegebene Callback-Funktion, mit den Parametern:
     * key für den Key und value für den Wert hinter dem Key.
     */
    public forEach(callbackfn: (key: K, value: V) => void): void {
        for (const entry of this.flatMembers()) {
            callbackfn(entry.key, entry.value);
        }
    }

    /**
     * Gibt den Wert hinter dem Key zurück.
     * @param key der Key, nach dem gesucht werden soll.
     * @returns den Wert, der hinter dem Key liegt oder undefined, wenn der Key nicht bekannt ist.
     */
    public get(key: K): V {
        const entry = this.internalGet(new Entry(key, null));
        return entry && entry.value;
    }

    /**
     * Fügt einen neuen Wert in die Map ein oder aktualisiert einen vorhandenen,
     * in dem Fall wird der Key nicht ausgetauscht.
     * @param key der Key, nach dem gesucht werden soll.
     * @param value der Wert, der hinter dem Key gespeichert werden soll.
     * @returns den Wert, der vorher hinter dem Key lag oder undefined, sollte der Key nicht bekannt gewesen sein.
     */
    public put(key: K, value: V): V {
        return this.internalAdd(new Entry(key, value));
    }

    /**
     * Entfernt einen Key und den Wert dahinter aus der Map.
     * @param key der Key, nach dem gesucht werden soll.
     * @returns den Wert, der vorher hinter dem Key lag oder undefined, sollte der Key nicht bekannt gewesen sein.
     */
    public remove(key: K): V {
        const list = this.members[key.hashCode() % this.currentSize];
        const i = list.findIndex((val) => val.equals(new Entry(key, null)));
        if (i >= 0) {
            const res = list.splice(i, 1)[0];
            this.length--;
            return res.value;
        }
        return undefined;
    }

    /**
     * Gibt die Anzahl der Key-Value-Paare in der Map zurück.
     * @returns die Anzahl der Elemente in der Map.
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
        for (let i = 0; i < this.currentSize; i++) {
            this.members[i] = [];
        }
    }

    /**
     * Interne Methode zum hinzufügen eines Elements.
     * @param entry das neue ELement
     */
    private internalAdd(entry: Entry<K, V>): V {
        const found = this.internalGet(entry);
        if (found === undefined) {
            this.members[entry.hashCode() % this.currentSize].push(entry);
            this.length++;
            if (this.length > this.currentSize) {
                this.expanding.next();
            }
            return undefined;
        } else {
            const res = found.value;
            found.value = entry.value;
            return res;
        }
    }

    /**
     * Interne Methode zum zurückgeben eines gesuchten Elements.
     * @param entry das gesuchte Element (nur relevant für den Key, siehe Entry)
     */
    private internalGet(entry: Entry<K, V>): Entry<K, V> {
        return this.members[entry.hashCode() % this.currentSize].find((val) => val.equals(entry));
    }

    /**
     * Interne Methode, die eine Liste aller Einträge der Map zurückgibt.
     */
    private flatMembers(): Entry<K, V>[] {
        return this.members.reduce((all, next) => [...all, ...next], []);
    }

    /**
     * Interne Methode, die das interne Array vergrößert.
     */
    private expandSize(): void {
        const old = this.flatMembers();
        this.init((this.length *= 2));
        old.forEach((val) => this.internalAdd(val));
    }
}

/**
 * Interne Klasse, repräsentiert die Einträge der Map als Key-Value-Paar. Implementiert EqualsHashCode, aber die
 * Gleichheit wird nur anhand des Keys ermittelt. Diese Absichtliche Ungenauigkeit erlaubt eine Nützliche
 * Funktionalität für die Map.
 */
class Entry<K extends EqualsHashCode, V> implements EqualsHashCode {
    constructor(public key: K, public value: V) {}

    equals(obj: any): boolean {
        return obj instanceof Entry && this.key.equals(obj.key);
    }

    hashCode(): number {
        return this.key.hashCode();
    }
}
