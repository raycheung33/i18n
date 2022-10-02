"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
const isSet_1 = require("./isSet");
const getFullScope_1 = require("./getFullScope");
function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    const locale = "locale" in options ? options.locale : i18n.locale;
    scope = (0, getFullScope_1.getFullScope)(i18n, scope, options)
        .split(i18n.defaultSeparator)
        .map((component) => i18n.transformKey(component))
        .join(".");
    const language = i18n.translations[locale];
    const entries = [language[scope]];
    entries.push(options.defaultValue);
    return entries.find((entry) => (0, isSet_1.isSet)(entry));
}
exports.lookup = lookup;
//# sourceMappingURL=lookup.js.map