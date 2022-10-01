import BigNumber from "bignumber.js";
import { sortBy, zipObject } from "lodash";
import { getFullScope } from "./getFullScope";
import { lookup } from "./lookup";
import { roundNumber } from "./roundNumber";
import { inferType } from "./inferType";
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
const INVERTED_DECIMAL_UNITS = zipObject(Object.values(DECIMAL_UNITS), Object.keys(DECIMAL_UNITS).map((key) => parseInt(key, 10)));
export function numberToHuman(i18n, input, options) {
    const roundOptions = {
        roundMode: options.roundMode,
        precision: options.precision,
        significant: options.significant,
    };
    let units;
    if (inferType(options.units) === "string") {
        const scope = options.units;
        units = lookup(i18n, scope);
        if (!units) {
            throw new Error(`The scope "${i18n.locale}${i18n.defaultSeparator}${getFullScope(i18n, scope, {})}" couldn't be found`);
        }
    }
    else {
        units = options.units;
    }
    let formattedNumber = roundNumber(new BigNumber(input), roundOptions);
    const unitExponents = (units) => sortBy(Object.keys(units).map((name) => INVERTED_DECIMAL_UNITS[name]), (numeric) => numeric * -1);
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
    const exponent = calculateExponent(new BigNumber(formattedNumber), units);
    const unit = determineUnit(units, exponent);
    formattedNumber = roundNumber(new BigNumber(formattedNumber).div(Math.pow(10, exponent)), roundOptions);
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
//# sourceMappingURL=numberToHuman.js.map