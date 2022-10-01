"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
const isSet_1 = require("./isSet");
const getFullScope_1 = require("./getFullScope");
function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    scope = (0, getFullScope_1.getFullScope)(i18n, scope, options);
    const entries = [scope];
    entries.push(options.defaultValue);
    return entries.find((entry) => (0, isSet_1.isSet)(entry));
}
exports.lookup = lookup;
//# sourceMappingURL=lookup.js.map