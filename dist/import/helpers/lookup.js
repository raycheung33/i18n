import { get } from "lodash";
import { isSet } from "./isSet";
import { getFullScope } from "./getFullScope";
import { inferType } from "./inferType";
export function lookup(i18n, scope, options = {}) {
    options = Object.assign({}, options);
    const locale = "locale" in options ? options.locale : i18n.locale;
    const localeType = inferType(locale);
    const locales = i18n.locales
        .get(localeType === "string" ? locale : typeof locale)
        .slice();
    scope = [getFullScope(i18n, scope, options)]
        .map((component) => i18n.transformKey(component));
    const entries = locales.map((locale) => get(i18n.translations, [locale, scope].join(".")));
    entries.push(options.defaultValue);
    return entries.find((entry) => isSet(entry));
}
//# sourceMappingURL=lookup.js.map