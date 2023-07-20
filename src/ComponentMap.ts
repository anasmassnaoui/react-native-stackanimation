class ComponentMap<T> extends Map<string, T> {

    #generateId = () => Date.now().toString(36);

    add(value: T, key?: string) {
        const initialKey = key ?? this.#generateId();
        this.set(initialKey, value);
        return initialKey;
    }

    getKeys() {
        return [...this.keys()];
    }

    clone() {
        return new ComponentMap(this);
    }

    static create<T>(values: T[]){
        const newMap = new ComponentMap<T>();
        for (const value of values) {
            newMap.add(value);
        }
        return newMap;
    }
}

export { ComponentMap };
