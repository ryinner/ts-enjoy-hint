import type { TsEnjoyHintTarget } from '../index';
import { getTargetRect } from './rect.utils';

export function isElementInViewport ({ target }: { target: TsEnjoyHintTarget }): boolean {
    const { top, left } = getTargetRect({ target });

    return top >= 0 &&
        left >= 0 &&
        top <= window.innerHeight &&
        left <= window.innerWidth;
}
