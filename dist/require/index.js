"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pluralization = exports.MissingTranslation = exports.Locales = exports.I18n = void 0;
var I18n_1 = require("./I18n");
Object.defineProperty(exports, "I18n", { enumerable: true, get: function () { return I18n_1.I18n; } });
var Locales_1 = require("./Locales");
Object.defineProperty(exports, "Locales", { enumerable: true, get: function () { return Locales_1.Locales; } });
var MissingTranslation_1 = require("./MissingTranslation");
Object.defineProperty(exports, "MissingTranslation", { enumerable: true, get: function () { return MissingTranslation_1.MissingTranslation; } });
var Pluralization_1 = require("./Pluralization");
Object.defineProperty(exports, "Pluralization", { enumerable: true, get: function () { return Pluralization_1.Pluralization; } });
__exportStar(require("./typing"), exports);
//# sourceMappingURL=index.js.map