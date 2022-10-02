var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { get, has, set } from "lodash";
import { Locales } from "./Locales";
import { Pluralization } from "./Pluralization";
import { MissingTranslation } from "./MissingTranslation";
import { camelCaseKeys, createTranslationOptions, formatNumber, inferType, interpolate, isSet, lookup, numberToDelimited, numberToHuman, numberToHumanSize, parseDate, pluralize, strftime, timeAgoInWords, } from "./helpers";
const DEFAULT_I18N_OPTIONS = {
    defaultLocale: "en",
    locale: "en",
    defaultSeparator: ".",
    placeholder: /(?:\{\{|%\{)(.*?)(?:\}\}?)/gm,
    enableFallback: false,
    missingBehavior: "message",
    missingTranslationPrefix: "",
    missingPlaceholder: (_i18n, placeholder) => `[missing "${placeholder}" value]`,
    nullPlaceholder: (i18n, placeholder, message, options) => i18n.missingPlaceholder(i18n, placeholder, message, options),
    transformKey: (key) => key,
};
export class I18n {
    constructor(translations = {}, options = {}) {
        this._locale = DEFAULT_I18N_OPTIONS.locale;
        this._defaultLocale = DEFAULT_I18N_OPTIONS.defaultLocale;
        this._version = 0;
        this.onChangeHandlers = [];
        this.translations = {};
        this.t = this.translate;
        this.p = this.pluralize;
        this.l = this.localize;
        this.distanceOfTimeInWords = this.timeAgoInWords;
        const { locale, enableFallback, missingBehavior, missingTranslationPrefix, missingPlaceholder, nullPlaceholder, defaultLocale, defaultSeparator, placeholder, transformKey, } = Object.assign(Object.assign({}, DEFAULT_I18N_OPTIONS), options);
        this.locale = locale;
        this.defaultLocale = defaultLocale;
        this.defaultSeparator = defaultSeparator;
        this.enableFallback = enableFallback;
        this.locale = locale;
        this.missingBehavior = missingBehavior;
        this.missingTranslationPrefix = missingTranslationPrefix;
        this.missingPlaceholder = missingPlaceholder;
        this.nullPlaceholder = nullPlaceholder;
        this.placeholder = placeholder;
        this.pluralization = new Pluralization(this);
        this.locales = new Locales(this);
        this.missingTranslation = new MissingTranslation(this);
        this.transformKey = transformKey;
        this.interpolate = interpolate;
        this.store(translations);
    }
    store(translations) {
        this.translations = translations;
        this.hasChanged();
    }
    get locale() {
        return this._locale || this.defaultLocale || "en";
    }
    set locale(newLocale) {
        if (typeof newLocale !== "string") {
            throw new Error(`Expected newLocale to be a string; got ${inferType(newLocale)}`);
        }
        const changed = this._locale !== newLocale;
        this._locale = newLocale;
        if (changed) {
            this.hasChanged();
        }
    }
    get defaultLocale() {
        return this._defaultLocale || "en";
    }
    set defaultLocale(newLocale) {
        if (typeof newLocale !== "string") {
            throw new Error(`Expected newLocale to be a string; got ${inferType(newLocale)}`);
        }
        const changed = this._defaultLocale !== newLocale;
        this._defaultLocale = newLocale;
        if (changed) {
            this.hasChanged();
        }
    }
    translate(scope, options) {
        options = Object.assign({}, options);
        const translationOptions = createTranslationOptions(this, scope, options);
        let translation;
        const hasFoundTranslation = translationOptions.some((translationOption) => {
            if (isSet(translationOption.scope)) {
                translation = lookup(this, translationOption.scope, options);
            }
            else if (isSet(translationOption.message)) {
                translation = translationOption.message;
            }
            return translation !== undefined && translation !== null;
        });
        if (!hasFoundTranslation) {
            return this.missingTranslation.get(scope, options);
        }
        if (typeof translation === "string") {
            translation = this.interpolate(this, translation, options);
        }
        else if (typeof translation === "object" &&
            translation &&
            isSet(options.count)) {
            translation = this.pluralize(options.count || 0, translation, options);
        }
        if (options && translation instanceof Array) {
            translation = translation.map((entry) => typeof entry === "string"
                ? interpolate(this, entry, options)
                : entry);
        }
        return translation;
    }
    pluralize(count, scope, options) {
        return pluralize(this, count, scope, Object.assign({}, options));
    }
    localize(type, value, options) {
        options = Object.assign({}, options);
        if (value === undefined || value === null) {
            return "";
        }
        switch (type) {
            case "currency":
                return this.numberToCurrency(value);
            case "number":
                return formatNumber(value, Object.assign({ delimiter: ",", precision: 3, separator: ".", significant: false, stripInsignificantZeros: false }, lookup(this, "number.format")));
            case "percentage":
                return this.numberToPercentage(value);
            default: {
                let localizedValue;
                if (type.match(/^(date|time)/)) {
                    localizedValue = this.toTime(type, value);
                }
                else {
                    localizedValue = value.toString();
                }
                return interpolate(this, localizedValue, options);
            }
        }
    }
    toTime(scope, input) {
        const date = parseDate(input);
        const format = lookup(this, scope);
        if (date.toString().match(/invalid/i)) {
            return date.toString();
        }
        if (!format) {
            return date.toString();
        }
        return this.strftime(date, format);
    }
    numberToCurrency(input, options = {}) {
        return formatNumber(input, Object.assign(Object.assign(Object.assign({ delimiter: ",", format: "%u%n", precision: 2, separator: ".", significant: false, stripInsignificantZeros: false, unit: "$" }, camelCaseKeys(this.get("number.format"))), camelCaseKeys(this.get("number.currency.format"))), options));
    }
    numberToPercentage(input, options = {}) {
        return formatNumber(input, Object.assign(Object.assign(Object.assign({ delimiter: "", format: "%n%", precision: 3, stripInsignificantZeros: false, separator: ".", significant: false }, camelCaseKeys(this.get("number.format"))), camelCaseKeys(this.get("number.percentage.format"))), options));
    }
    numberToHumanSize(input, options = {}) {
        return numberToHumanSize(this, input, Object.assign(Object.assign(Object.assign({ delimiter: "", precision: 3, significant: true, stripInsignificantZeros: true, units: {
                billion: "Billion",
                million: "Million",
                quadrillion: "Quadrillion",
                thousand: "Thousand",
                trillion: "Trillion",
                unit: "",
            } }, camelCaseKeys(this.get("number.human.format"))), camelCaseKeys(this.get("number.human.storage_units"))), options));
    }
    numberToHuman(input, options = {}) {
        return numberToHuman(this, input, Object.assign(Object.assign(Object.assign({ delimiter: "", separator: ".", precision: 3, significant: true, stripInsignificantZeros: true, format: "%n %u", roundMode: "default", units: {
                billion: "Billion",
                million: "Million",
                quadrillion: "Quadrillion",
                thousand: "Thousand",
                trillion: "Trillion",
                unit: "",
            } }, camelCaseKeys(this.get("number.human.format"))), camelCaseKeys(this.get("number.human.decimal_units"))), options));
    }
    numberToRounded(input, options) {
        return formatNumber(input, Object.assign({ unit: "", precision: 3, significant: false, separator: ".", delimiter: "", stripInsignificantZeros: false }, options));
    }
    numberToDelimited(input, options = {}) {
        return numberToDelimited(input, Object.assign({ delimiterPattern: /(\d)(?=(\d\d\d)+(?!\d))/g, delimiter: ",", separator: "." }, options));
    }
    withLocale(locale, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalLocale = this.locale;
            try {
                this.locale = locale;
                yield callback();
            }
            finally {
                this.locale = originalLocale;
            }
        });
    }
    strftime(date, format, options = {}) {
        return strftime(date, format, Object.assign(Object.assign(Object.assign({}, camelCaseKeys(lookup(this, "date"))), { meridian: {
                am: lookup(this, "time.am") || "AM",
                pm: lookup(this, "time.pm") || "PM",
            } }), options));
    }
    update(path, override, options = { strict: false }) {
        if (options.strict && !has(this.translations, path)) {
            throw new Error(`The path "${path}" is not currently defined`);
        }
        const currentNode = get(this.translations, path);
        const currentType = inferType(currentNode);
        const overrideType = inferType(override);
        if (options.strict && currentType !== overrideType) {
            throw new Error(`The current type for "${path}" is "${currentType}", but you're trying to override it with "${overrideType}"`);
        }
        let newNode;
        if (overrideType === "object") {
            newNode = Object.assign(Object.assign({}, currentNode), override);
        }
        else {
            newNode = override;
        }
        set(this.translations, path, newNode);
        this.hasChanged();
    }
    toSentence(items, options = {}) {
        const { wordsConnector, twoWordsConnector, lastWordConnector } = Object.assign(Object.assign({ wordsConnector: ", ", twoWordsConnector: " and ", lastWordConnector: ", and " }, camelCaseKeys(lookup(this, "support.array"))), options);
        const size = items.length;
        switch (size) {
            case 0:
                return "";
            case 1:
                return `${items[0]}`;
            case 2:
                return items.join(twoWordsConnector);
            default:
                return [
                    items.slice(0, size - 1).join(wordsConnector),
                    lastWordConnector,
                    items[size - 1],
                ].join("");
        }
    }
    timeAgoInWords(fromTime, toTime, options = {}) {
        return timeAgoInWords(this, fromTime, toTime, options);
    }
    onChange(callback) {
        this.onChangeHandlers.push(callback);
        return () => {
            this.onChangeHandlers.splice(this.onChangeHandlers.indexOf(callback), 1);
        };
    }
    get version() {
        return this._version;
    }
    get(scope) {
        return lookup(this, scope);
    }
    runCallbacks() {
        this.onChangeHandlers.forEach((callback) => callback(this));
    }
    hasChanged() {
        this._version += 1;
        this.runCallbacks();
    }
}
//# sourceMappingURL=I18n.js.map