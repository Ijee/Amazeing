export interface EqualsHashCode {
    /**
     * Gibt zurück, ob das übergebene Objekt gleich zum aktuellen Objekt ist.
     * @param obj das übergebene Objekt
     * @return <code>true</code> wenn die beiden Objekte sind gleichen, <code>false</code> sonst
     */
    equals(obj: any): boolean;

    /**
     * Gibt eine Hash-Repräsentation (Ganzzahl) zurück. Je verteilter das Ergebnis, desto effizienter sind Klassen, die darauf
     * angewiesen sind. (HashMap, HashSet)
     */
    hashCode(): number;
}
