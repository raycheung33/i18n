"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookup = void 0;
const lodash_1 = require("lodash");
const isSet_1 = require("./isSet");
const getFullScope_1 = require("./getFullScope");
const inferType_1 = require("./inferType");
function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    const locale = "locale" in options ? options.locale : i18n.locale;
    const localeType = (0, inferType_1.inferType)(locale);
    const locales = i18n.locales
        .get(localeType === "string" ? locale : typeof locale)
        .slice();
    scope = [(0, getFullScope_1.getFullScope)(i18n, scope, options)]
        .map((component) => i18n.transformKey(component));
    const entries = locales.map((locale) => (0, lodash_1.get)(i18n.translations, [locale, scope].join(".")));
    entries.push(options.defaultValue);
    return entries.find((entry) => (0, isSet_1.isSet)(entry));
}
exports.lookup = lookup;
//# sourceMappingURL=lookup.js.map