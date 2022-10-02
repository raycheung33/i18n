import { isSet } from "./isSet";
import { getFullScope } from "./getFullScope";
export function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    const locale = "locale" in options ? options.locale : i18n.locale;
    scope = getFullScope(i18n, scope, options)
        .split(i18n.defaultSeparator)
        .map((component) => i18n.transformKey(component))
        .join(".");
    const language = i18n.translations[locale];
    const entries = [language[scope]];
    entries.push(options.defaultValue);
    return entries.find((entry) => isSet(entry));
}
//# sourceMappingURL=lookup.js.map