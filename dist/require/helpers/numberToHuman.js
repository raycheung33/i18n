"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.numberToHuman = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const lodash_1 = require("lodash");
const getFullScope_1 = require("./getFullScope");
const lookup_1 = require("./lookup");
const roundNumber_1 = require("./roundNumber");
const inferType_1 = require("./inferType");
const DECIMAL_UNITS = {
    "0": "unit",
    "1": "ten",
    "2": "hundred",
    "3": "thousand",
    "6": "million",
    "9": "billion",
    "12": "trillion",
    "15": "quadrillion",
    "-1": "deci",
    "-2": "centi",
    "-3": "mili",
    "-6": "micro",
    "-9": "nano",
    "-12": "pico",
    "-15": "femto",
};
const INVERTED_DECIMAL_UNITS = (0, lodash_1.zipObject)(Object.values(DECIMAL_UNITS), Object.keys(DECIMAL_UNITS).map((key) => parseInt(key, 10)));
function numberToHuman(i18n, input, options) {
    const roundOptions = {
        roundMode: options.roundMode,
        precision: options.precision,
        significant: options.significant,
    };
    let units;
    if ((0, inferType_1.inferType)(options.units) === "string") {
        const scope = options.units;
        units = (0, lookup_1.lookup)(i18n, scope);
        if (!units) {
            throw new Error(`The scope "${i18n.locale}${i18n.defaultSeparator}${(0, getFullScope_1.getFullScope)(i18n, scope, {})}" couldn't be found`);
        }
    }
    else {
        units = options.units;
    }
    let formattedNumber = (0, roundNumber_1.roundNumber)(new bignumber_js_1.default(input), roundOptions);
    const unitExponents = (units) => (0, lodash_1.sortBy)(Object.keys(units).map((name) => INVERTED_DECIMAL_UNITS[name]), (numeric) => numeric * -1);
    const calculateExponent = (num, units) => {
        const exponent = num.isZero()
            ? 0
            : Math.floor(Math.log10(num.abs().toNumber()));
        return unitExponents(units).find((exp) => exponent >= exp) || 0;
    };
    const determineUnit = (units, exponent) => {
        const expName = DECIMAL_UNITS[exponent.toString()];
        return units[expName] || "";
    };
    const exponent = calculateExponent(new bignumber_js_1.default(formattedNumber), units);
    const unit = determineUnit(units, exponent);
    formattedNumber = (0, roundNumber_1.roundNumber)(new bignumber_js_1.default(formattedNumber).div(Math.pow(10, exponent)), roundOptions);
    if (options.stripInsignificantZeros) {
        let [whole, significand] = formattedNumber.split(".");
        significand = (significand || "").replace(/0+$/, "");
        formattedNumber = whole;
        if (significand) {
            formattedNumber += `${options.separator}${significand}`;
        }
    }
    return options.format
        .replace("%n", formattedNumber || "0")
        .replace("%u", unit)
        .trim();
}
exports.numberToHuman = numberToHuman;
//# sourceMappingURL=numberToHuman.js.map