"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.camelCaseKeys = void 0;
const lodash_1 = require("lodash");
function camelCaseKeys(target) {
    if (!target) {
        return {};
    }
    return Object.keys(target).reduce((buffer, key) => {
        buffer[(0, lodash_1.camelCase)(key)] = target[key];
        return buffer;
    }, {});
}
exports.camelCaseKeys = camelCaseKeys;
//# sourceMappingURL=camelCaseKeys.js.map