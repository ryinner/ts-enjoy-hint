import type { TsEnjoyHintShape, TsEnjoyHintTargetOption } from '@/index';
import { getTargetRect } from './rect.utils';

const DEFAULT_FILL_COLOR = '#00000099';

export function cleanCanvas ({ canvas }: { canvas: HTMLCanvasElement }): void {
    const context = <CanvasRenderingContext2D> canvas.getContext('2d');
    context.globalCompositeOperation = 'color';
    context.clearRect(0, 0, canvas.width, canvas.height);
}

export function canvasDrawer (canvas: HTMLCanvasElement, target: TsEnjoyHintTargetOption): void {
    const elementRect = getTargetRect({ target: target.target });
    const canvasRect = canvas.getBoundingClientRect();
    const context = <CanvasRenderingContext2D> canvas.getContext('2d');
    drawHintByShape({ context, rect: canvasRect });
    context.globalCompositeOperation = 'destination-out';
    drawHintByShape({ context, rect: elementRect, color: '#fff' }, target.shape);
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

function drawRectangle ({ context, rect, color }: TsEnjoyHintDrawFunctionArguments): void {
    const { x, y, width, height } = rect;

    context.fillStyle = color ?? DEFAULT_FILL_COLOR;
    context.fillRect(x, y, width, height);
}

function drawCircle ({ context, rect, color }: TsEnjoyHintDrawFunctionArguments): void {
    const { x, y, width, height } = rect;

    const xCenter = x + width / 2;
    const yCenter = y + height / 2;
    const radius = Math.sqrt(width ** 2 + height ** 2) / 2;

    context.beginPath();
    context.arc(xCenter, yCenter, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color ?? DEFAULT_FILL_COLOR;
    context.fill();
}

export function createFullScreenCanvas (): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    return canvas;
}

interface TsEnjoyHintDrawFunctionArguments {
    context: CanvasRenderingContext2D;
    rect: DOMRect;
    color?: string;
};
