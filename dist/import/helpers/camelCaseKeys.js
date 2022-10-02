import { camelCase } from "lodash";
export function camelCaseKeys(target) {
    if (!target) {
        return {};
    }
    return Object.keys(target).reduce((buffer, key) => {
        buffer[camelCase(key)] = target[key];
        return buffer;
    }, {});
}
//# sourceMappingURL=camelCaseKeys.js.map