import { isSet } from "./isSet";
import { getFullScope } from "./getFullScope";
export function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    scope = getFullScope(i18n, scope, options);
    const entries = [scope];
    entries.push(options.defaultValue);
    return entries.find((entry) => isSet(entry));
}
//# sourceMappingURL=lookup.js.map