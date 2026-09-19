import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { PROSLOT_HREF, PROSLOT_LABEL, PROSLOT_NAME, PROSLOT_REL, PROSLOT_TARGET, } from './constants.js';
export function PoweredBy({ tagline, className, linkClassName, labelClassName, nameClassName, taglineClassName, }) {
    return (_jsxs("div", { className: className, children: [_jsxs("a", { href: PROSLOT_HREF, target: PROSLOT_TARGET, rel: PROSLOT_REL, className: linkClassName, children: [_jsxs("span", { className: labelClassName, children: [PROSLOT_LABEL, " "] }), _jsx("strong", { className: nameClassName, children: PROSLOT_NAME })] }), tagline ? _jsx("div", { className: taglineClassName, children: tagline }) : null] }));
}
