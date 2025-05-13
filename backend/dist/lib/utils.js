"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseColor = void 0;
const parseColor = (color) => {
    const hex = color.startsWith("#") ? color.slice(1) : color;
    return parseInt(hex, 16);
};
exports.parseColor = parseColor;
