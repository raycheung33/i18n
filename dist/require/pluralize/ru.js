"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ru = void 0;
const ru = (_i18n, count) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    let key;
    const one = mod10 === 1 && mod100 !== 11;
    const few = [2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100);
    const many = mod10 === 0 ||
        [5, 6, 7, 8, 9].includes(mod10) ||
        [11, 12, 13, 14].includes(mod100);
    if (one) {
        key = "one";
    }
    else if (few) {
        key = "few";
    }
    else if (many) {
        key = "many";
    }
    else {
        key = "other";
    }
    return [key];
};
exports.ru = ru;
//# sourceMappingURL=ru.js.map