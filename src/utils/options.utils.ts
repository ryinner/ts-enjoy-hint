import type { TsEnjoyHintTarget } from '../index';
import { getTargetRect } from './rect.utils';

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

export function createNonClickableStroke (): TsEnjoyHintNonClickableStokes {
    const leftStroke = createAbsoluteNonClickableDiv();
    leftStroke.style.top = '0';
    leftStroke.classList.add('ts-enjoy-hint-left');
    const rightStroke = createAbsoluteNonClickableDiv();
    rightStroke.style.top = '0';
    rightStroke.classList.add('ts-enjoy-hint-right');
    const topStroke = createAbsoluteNonClickableDiv();
    topStroke.style.left = '0';
    topStroke.classList.add('ts-enjoy-hint-top');
    const bottomStroke = createAbsoluteNonClickableDiv();
    bottomStroke.style.left = '0';
    bottomStroke.classList.add('ts-enjoy-hint-bottom');

    return { left: leftStroke, right: rightStroke, top: topStroke, bottom: bottomStroke };
}

export function resizeNonClickableStrokeToTarget (target: TsEnjoyHintTarget, strokes: TsEnjoyHintNonClickableStokes): void {
    const { x, y, width, height, left } = getTargetRect({ target });
    const { innerHeight, innerWidth } = window;

    strokes.left.style.left = '0px';
    strokes.left.style.width = `${left}px`;
    strokes.left.style.height = '100%';

    strokes.right.style.right = '0px';
    strokes.right.style.width = `${innerWidth - (x + width)}px`;
    strokes.right.style.height = '100%';

    strokes.top.style.height = `${y}px`;
    strokes.top.style.width = '100%';
    strokes.top.style.top = '0px';

    strokes.bottom.style.bottom = '0';
    strokes.bottom.style.height = `${innerHeight - (y + height)}px`;
    strokes.bottom.style.width = '100%';
}

function createAbsoluteNonClickableDiv (): HTMLDivElement {
    const div = document.createElement('div');
    div.style.position = 'absolute';

    return div;
}

export interface TsEnjoyHintNonClickableStokes {
    left: HTMLDivElement;
    right: HTMLDivElement;
    top: HTMLDivElement;
    bottom: HTMLDivElement;
}
