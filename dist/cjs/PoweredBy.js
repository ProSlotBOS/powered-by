"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoweredBy = PoweredBy;
const jsx_runtime_1 = require("react/jsx-runtime");
const constants_js_1 = require("./constants.js");
function PoweredBy({ tagline, title, className, linkClassName, labelClassName, nameClassName, taglineClassName, }) {
    return ((0, jsx_runtime_1.jsxs)("div", { className: className, children: [(0, jsx_runtime_1.jsxs)("a", { href: constants_js_1.PROSLOT_HREF, target: constants_js_1.PROSLOT_TARGET, rel: constants_js_1.PROSLOT_REL, title: title, className: linkClassName, children: [(0, jsx_runtime_1.jsxs)("span", { className: labelClassName, children: [constants_js_1.PROSLOT_LABEL, " "] }), (0, jsx_runtime_1.jsx)("strong", { className: nameClassName, children: constants_js_1.PROSLOT_NAME })] }), tagline ? (0, jsx_runtime_1.jsx)("div", { className: taglineClassName, children: tagline }) : null] }));
}
