import type { TsEnjoyHintTarget } from '../index';
import { getTargetRect } from './rect.utils';

export function isElementInViewport ({ target }: { target: TsEnjoyHintTarget }): boolean {
    const { top, left, bottom, right } = getTargetRect({ target });

    return top >= 0 &&
        left >= 0 &&
        bottom <= window.innerHeight &&
        right <= window.innerWidth;
}
