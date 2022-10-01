import { isArray, isObject, flattenDeep } from "lodash";
class PropertyFlatList {
    constructor(target) {
        this.target = target;
    }
    call() {
        const keys = flattenDeep(Object.keys(this.target).map((key) => this.compute(this.target[key], key)));
        keys.sort();
        return keys;
    }
    compute(value, path) {
        if (!isArray(value) && isObject(value)) {
            return Object.keys(value).map((key) => this.compute(value[key], `${path}.${key}`));
        }
        else {
            return path;
        }
    }
}
export function propertyFlatList(target) {
    return new PropertyFlatList(target).call();
}
//# sourceMappingURL=propertyFlatList.js.map