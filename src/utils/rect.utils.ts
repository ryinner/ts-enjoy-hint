import type { TsEnjoyHintTarget } from '../index';
import { getElementFromTarget } from './options.utils';

const rectStore: { rect?: DOMRect; target?: TsEnjoyHintTarget } = {};

export function getTargetRect ({ target, force }: { target: TsEnjoyHintTarget; force?: boolean }): DOMRect {
    if (force ?? rectStore.target !== target) {
        rectStore.target = target;
        rectStore.rect = getElementFromTarget(target).getBoundingClientRect();
    }

    return <DOMRect> rectStore.rect;
}
