import type { TsEnjoyHintTarget } from '../index';
import { getElementFromTarget } from './options.utils';

const rectStore: { rect?: DOMRect; element?: Element } = {};

export function getTargetRect ({ target, force }: { target: TsEnjoyHintTarget; force?: boolean }): DOMRect {
    const element = getElementFromTarget(target);
    if (force ?? rectStore.element !== element) {
        rectStore.element = element;
        rectStore.rect = rectStore.element?.getBoundingClientRect();
    }

    return <DOMRect> rectStore.rect;
}
