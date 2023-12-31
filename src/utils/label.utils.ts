import type { TsEnjoyHintTargetOption } from '../index';
import { getTargetRect } from './rect.utils';
import { getSettings } from './settings.utils';

export const DEFAULT_PADDING = '1.5rem';

export function createLabel (): HTMLDivElement {
    const label = document.createElement('div');
    label.style.position = 'fixed';
    label.style.display = 'flex';
    label.style.boxSizing = 'border-box';
    label.style.color = '#fff';
    label.style.fontSize = '1.2rem';
    label.style.zIndex = `${getSettings().zIndex}`;

    const labelContent = document.createElement('div');
    labelContent.classList.add('ts-enjoy-hint-label__content');

    const labelText = document.createElement('div');
    labelText.classList.add('ts-enjoy-hint-label__text');
    labelContent.appendChild(labelText);

    label.appendChild(labelContent);

    label.classList.add('ts-enjoy-hint-label');

    return label;
}

export function resizeLabel ({ target, label }: { label: HTMLDivElement; target: TsEnjoyHintTargetOption }): void {
    const labelContent = label.children[0];
    const labelText = labelContent.querySelector('.ts-enjoy-hint-label__text');
    if (labelText !== null) {
        labelText.textContent = target.label ?? '';
    }

    const { position, space, isVr } = getLabelPosition({ target });
    const { x, y, width, height } = getTargetRect({ target: target.target });

    label.style.top = '0';
    label.style.left = '0';
    label.style.bottom = '0';
    label.style.right = '0';
    label.style.maxWidth = 'initial';
    label.style.maxHeight = 'initial';
    label.style.alignItems = 'initial';
    label.style.justifyContent = 'initial';
    label.style.transform = 'initial';
    label.style.padding = 'initial';

    if (isVr) {
        label.style.maxHeight = `${space}px`;
        label.style.maxWidth = '100%';
        label.style.left = `${x + width / 2}px`;
        label.style.transform = 'translateX(-50%)';
        label.style.justifyContent = 'center';
    } else {
        label.style.maxHeight = '100%';
        label.style.maxWidth = `${space}px`;
        label.style.top = `${y + height / 2}px`;
        label.style.transform = 'translateY(-50%)';
        label.style.alignItems = 'center';
    }

    switch (position) {
        case 'bottom':
            label.style.top = `${y + height}px`;
            label.style.alignItems = 'start';
            label.style.paddingTop = DEFAULT_PADDING;
            break;

        case 'top':
            label.style.alignItems = 'end';
            label.style.paddingBottom = DEFAULT_PADDING;
            break;

        case 'left':
            label.style.right = `${x}px`;
            label.style.justifyContent = 'end';
            label.style.paddingRight = DEFAULT_PADDING;
            break;

        case 'right':
            label.style.left = `${x + width}px`;
            label.style.justifyContent = 'start';
            label.style.paddingLeft = DEFAULT_PADDING;
            break;
    }
}

function getLabelPosition ({ target }: { target: TsEnjoyHintTargetOption }): { position: 'right' | 'left' | 'top' | 'bottom'; space: number; isVr: boolean } {
    const { x, y, width, height } = getTargetRect({ target: target.target });
    const { innerHeight, innerWidth } = window;
    const xEnd = x + width;
    const yEnd = y + height;

    const leftSpace = x;
    const rightSpace = innerWidth - xEnd;
    const topSpace = y;
    const bottomSpace = innerHeight - yEnd;

    const vrPosition = topSpace >= bottomSpace ? 'top' : 'bottom';
    const hrPosition = rightSpace >= leftSpace ? 'right' : 'left';

    const vrSpace = vrPosition === 'top' ? topSpace : bottomSpace;
    const hrSpace = hrPosition === 'right' ? rightSpace : leftSpace;

    const isVrMoreFree = vrSpace >= hrSpace;

    return {
        position: isVrMoreFree ? vrPosition : hrPosition,
        space: isVrMoreFree ? vrSpace : hrSpace,
        isVr: isVrMoreFree
    };
};
