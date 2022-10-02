"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatNumber = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const lodash_1 = require("lodash");
const _1 = require(".");
function replaceInFormat(format, { formattedNumber, unit }) {
    return format.replace("%n", formattedNumber).replace("%u", unit);
}
function computeSignificand({ significand, whole, precision, }) {
    if (whole === "0" || precision === null) {
        return significand;
    }
    const limit = Math.max(0, precision - whole.length);
    return (significand !== null && significand !== void 0 ? significand : "").substr(0, limit);
}
function formatNumber(input, options) {
    var _a, _b, _c;
    const originalNumber = new bignumber_js_1.default(input);
    if (options.raise && !originalNumber.isFinite()) {
        throw new Error(`"${input}" is not a valid numeric value`);
    }
    const roundedNumber = (0, _1.roundNumber)(originalNumber, options);
    const numeric = new bignumber_js_1.default(roundedNumber);
    const isNegative = numeric.lt(0);
    const isZero = numeric.isZero();
    let [whole, significand] = roundedNumber.split(".");
    const buffer = [];
    let formattedNumber;
    const positiveFormat = (_a = options.format) !== null && _a !== void 0 ? _a : "%n";
    const negativeFormat = (_b = options.negativeFormat) !== null && _b !== void 0 ? _b : `-${positiveFormat}`;
    const format = isNegative && !isZero ? negativeFormat : positiveFormat;
    whole = whole.replace("-", "");
    while (whole.length > 0) {
        buffer.unshift(whole.substr(Math.max(0, whole.length - 3), 3));
        whole = whole.substr(0, whole.length - 3);
    }
    whole = buffer.join("");
    formattedNumber = buffer.join(options.delimiter);
    if (options.significant) {
        significand = computeSignificand({
            whole,
            significand,
            precision: options.precision,
        });
    }
    else {
        significand = significand !== null && significand !== void 0 ? significand : (0, lodash_1.repeat)("0", (_c = options.precision) !== null && _c !== void 0 ? _c : 0);
    }
    if (options.stripInsignificantZeros && significand) {
        significand = significand.replace(/0+$/, "");
    }
    if (originalNumber.isNaN()) {
        formattedNumber = input.toString();
    }
    if (significand && originalNumber.isFinite()) {
        formattedNumber += (options.separator || ".") + significand;
    }
    return replaceInFormat(format, {
        formattedNumber,
        unit: options.unit,
    });
}
exports.formatNumber = formatNumber;
//# sourceMappingURL=formatNumber.js.map