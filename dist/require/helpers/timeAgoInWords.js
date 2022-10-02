"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timeAgoInWords = void 0;
const lodash_1 = require("lodash");
const parseDate_1 = require("./parseDate");
const within = (start, end, actual) => actual >= start && actual <= end;
function timeAgoInWords(i18n, fromTime, toTime, options = {}) {
    const scope = options.scope || "datetime.distance_in_words";
    const t = (name, count = 0) => i18n.t(name, { count, scope });
    fromTime = (0, parseDate_1.parseDate)(fromTime);
    toTime = (0, parseDate_1.parseDate)(toTime);
    let fromInSeconds = fromTime.getTime() / 1000;
    let toInSeconds = toTime.getTime() / 1000;
    if (fromInSeconds > toInSeconds) {
        [fromTime, toTime, fromInSeconds, toInSeconds] = [
            toTime,
            fromTime,
            toInSeconds,
            fromInSeconds,
        ];
    }
    const distanceInSeconds = Math.round(toInSeconds - fromInSeconds);
    const distanceInMinutes = Math.round((toInSeconds - fromInSeconds) / 60);
    const distanceInHours = distanceInMinutes / 60;
    const distanceInDays = distanceInHours / 24;
    const distanceInHoursRounded = Math.round(distanceInMinutes / 60);
    const distanceInDaysRounded = Math.round(distanceInDays);
    const distanceInMonthsRounded = Math.round(distanceInDaysRounded / 30);
    if (within(0, 1, distanceInMinutes)) {
        if (!options.includeSeconds) {
            return distanceInMinutes === 0
                ? t("less_than_x_minutes", 1)
                : t("x_minutes", distanceInMinutes);
        }
        if (within(0, 4, distanceInSeconds)) {
            return t("less_than_x_seconds", 5);
        }
        if (within(5, 9, distanceInSeconds)) {
            return t("less_than_x_seconds", 10);
        }
        if (within(10, 19, distanceInSeconds)) {
            return t("less_than_x_seconds", 20);
        }
        if (within(20, 39, distanceInSeconds)) {
            return t("half_a_minute");
        }
        if (within(40, 59, distanceInSeconds)) {
            return t("less_than_x_minutes", 1);
        }
        return t("x_minutes", 1);
    }
    if (within(2, 44, distanceInMinutes)) {
        return t("x_minutes", distanceInMinutes);
    }
    if (within(45, 89, distanceInMinutes)) {
        return t("about_x_hours", 1);
    }
    if (within(90, 1439, distanceInMinutes)) {
        return t("about_x_hours", distanceInHoursRounded);
    }
    if (within(1440, 2519, distanceInMinutes)) {
        return t("x_days", 1);
    }
    if (within(2520, 43199, distanceInMinutes)) {
        return t("x_days", distanceInDaysRounded);
    }
    if (within(43200, 86399, distanceInMinutes)) {
        return t("about_x_months", Math.round(distanceInMinutes / 43200));
    }
    if (within(86400, 525599, distanceInMinutes)) {
        return t("x_months", distanceInMonthsRounded);
    }
    let fromYear = fromTime.getFullYear();
    if (fromTime.getMonth() + 1 >= 3) {
        fromYear += 1;
    }
    let toYear = toTime.getFullYear();
    if (toTime.getMonth() + 1 < 3) {
        toYear -= 1;
    }
    const leapYears = fromYear > toYear
        ? 0
        : (0, lodash_1.range)(fromYear, toYear).filter((year) => new Date(year, 1, 29).getMonth() == 1).length;
    const minutesInYear = 525600;
    const minuteOffsetForLeapYear = leapYears * 1440;
    const minutesWithOffset = distanceInMinutes - minuteOffsetForLeapYear;
    const distanceInYears = Math.trunc(minutesWithOffset / minutesInYear);
    const diff = parseFloat((minutesWithOffset / minutesInYear - distanceInYears).toPrecision(3));
    if (diff < 0.25) {
        return t("about_x_years", distanceInYears);
    }
    if (diff < 0.75) {
        return t("over_x_years", distanceInYears);
    }
    return t("almost_x_years", distanceInYears + 1);
}
exports.timeAgoInWords = timeAgoInWords;
//# sourceMappingURL=timeAgoInWords.js.map