import type { TsEnjoyHintShape, TsEnjoyHintTargetOption } from '@/index';
import { getElementFromTarget } from '@/utils/options.utils';

export function canvasDrawer (canvas: HTMLCanvasElement, target: TsEnjoyHintTargetOption): void {
    const elementRect = getElementFromTarget(target.target).getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const context = <CanvasRenderingContext2D> canvas.getContext('2d');
    context.globalCompositeOperation = 'xor';

    drawHintByShape({ context, rect: canvasRect });
    drawHintByShape({ context, rect: elementRect }, target.shape);
}

function drawHintByShape (drawArguments: TsEnjoyHintDrawFunctionArguments, shape?: TsEnjoyHintShape): void {
    let func!: (drawArguments: TsEnjoyHintDrawFunctionArguments) => void;
    switch (shape) {
        case 'circle':
            func = drawCircle;
            break;

        default:
            func = drawRectangle;
            break;
    }
    func(drawArguments);
}

function drawRectangle ({ context, rect }: TsEnjoyHintDrawFunctionArguments): void {
    const { top, left, width, height } = rect;

    context.fillRect(top, left, width, height);
}

function drawCircle ({ context, rect }: TsEnjoyHintDrawFunctionArguments): void {
    const { x, y, width, height } = rect;

    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

    context.arc(x, y, radius, 0, 2 * Math.PI);
}

export function createFullScreenCanvas (): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';

    return canvas;
}

interface TsEnjoyHintDrawFunctionArguments {
    context: CanvasRenderingContext2D;
    rect: DOMRect;
};
