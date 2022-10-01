import BigNumber from "bignumber.js";
import { repeat } from "lodash";
import { roundNumber } from ".";
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
export function formatNumber(input, options) {
    var _a, _b, _c;
    const originalNumber = new BigNumber(input);
    if (options.raise && !originalNumber.isFinite()) {
        throw new Error(`"${input}" is not a valid numeric value`);
    }
    const roundedNumber = roundNumber(originalNumber, options);
    const numeric = new BigNumber(roundedNumber);
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
        significand = significand !== null && significand !== void 0 ? significand : repeat("0", (_c = options.precision) !== null && _c !== void 0 ? _c : 0);
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
//# sourceMappingURL=formatNumber.js.map