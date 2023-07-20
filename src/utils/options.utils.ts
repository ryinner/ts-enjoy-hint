import type { TsEnjoyHintTarget } from '../index';

export function getElementFromTarget (target: TsEnjoyHintTarget): Element {
    if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element === null) {
            throw new TypeError('Only selectors and HtmlElements can be target for TsEnjoyHint');
        }
        return element;
    }
    return target;
}
