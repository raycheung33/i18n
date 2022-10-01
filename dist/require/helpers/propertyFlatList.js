"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertyFlatList = void 0;
const lodash_1 = require("lodash");
class PropertyFlatList {
    constructor(target) {
        this.target = target;
    }
    call() {
        const keys = (0, lodash_1.flattenDeep)(Object.keys(this.target).map((key) => this.compute(this.target[key], key)));
        keys.sort();
        return keys;
    }
    compute(value, path) {
        if (!(0, lodash_1.isArray)(value) && (0, lodash_1.isObject)(value)) {
            return Object.keys(value).map((key) => this.compute(value[key], `${path}.${key}`));
        }
        else {
            return path;
        }
    }
}
function propertyFlatList(target) {
    return new PropertyFlatList(target).call();
}
exports.propertyFlatList = propertyFlatList;
//# sourceMappingURL=propertyFlatList.js.map