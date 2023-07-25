import { createButton } from './utils/button.utils';
import { canvasDrawer, cleanCanvas, createFullScreenCanvas } from './utils/canvas.utils';
import { createLabel, resizeLabel } from './utils/label.utils';
import { createNonClickableStroke, getElementFromTarget, resizeNonClickableStrokeToTarget, type TsEnjoyHintNonClickableStokes } from './utils/options.utils';
import { getTargetRect } from './utils/rect.utils';
import { throttle } from './utils/throttle.utils';

class TypescriptEnjoyHint {
    private current: number = 0;

    private canvas!: HTMLCanvasElement;
    private stroke!: TsEnjoyHintNonClickableStokes;
    private label!: HTMLDivElement;
    private buttons: { next?: HTMLButtonElement; close?: HTMLButtonElement; previous?: HTMLButtonElement } = {
        next: undefined,
        close: undefined,
        previous: undefined
    };

    private hints!: TsEnjoyHintTargetOption[];

    private resizeFunc!: ReturnType<typeof throttle>;

    apply (options: TsEnjoyHintOptions | TsEnjoyHintOptions[]): void {
        this.current = 0;

        const arrayOptions = !Array.isArray(options) ? [options] : options;

        const parsedOptions = arrayOptions.map(optionUnknown => {
            if (!isTsEnjoyHintTargetOption(optionUnknown)) {
                return { target: optionUnknown };
            }
            return optionUnknown;
        });

        this.hints = parsedOptions;
    }

    open (): void {
        this.setCurrentFirstIndex();
        if (this.canvas === undefined) {
            this.canvas = createFullScreenCanvas();
            document.body.appendChild(this.canvas);
        }
        if (this.stroke === undefined) {
            this.stroke = createNonClickableStroke();
            document.body.appendChild(this.stroke.bottom);
            document.body.appendChild(this.stroke.left);
            document.body.appendChild(this.stroke.right);
            document.body.appendChild(this.stroke.top);
        }
        for (const buttonType in this.buttons) {
            if (this.buttons[<keyof TypescriptEnjoyHint['buttons']> buttonType] === undefined) {
                this.buttons[<keyof TypescriptEnjoyHint['buttons']> buttonType] = createButton({ text: 'Button' });
            }
        }
        if (this.label === undefined) {
            this.label = createLabel();
            const labelContent = this.label.children[0];
            if (this.buttons.next !== undefined) {
                const nextFunc = this.next.bind(this);
                this.buttons.next.onclick = nextFunc;
                labelContent.appendChild(this.buttons.next);
            }
            if (this.buttons.previous !== undefined) {
                const previousFunc = this.previous.bind(this);
                this.buttons.previous.onclick = previousFunc;
                labelContent.appendChild(this.buttons.previous);
            }
            document.body.appendChild(this.label);
        }
        this.render(this.getCurrent());
        document.body.style.overflow = 'hidden';
        const resizeFunc = throttle(this.resize.bind(this), 100);
        this.resizeFunc = resizeFunc;
        window.addEventListener('resize', this.resizeFunc);
    }

    close (): void {
        window.removeEventListener('resize', this.resizeFunc);
        document.body.removeChild(this.canvas);
        document.body.removeChild(this.label);
        document.body.removeChild(this.stroke.bottom);
        document.body.removeChild(this.stroke.left);
        document.body.removeChild(this.stroke.right);
        document.body.removeChild(this.stroke.top);
    }

    next (): void {
        if (this.current === this.hints.length - 1) {
            this.close();
        } else {
            const target = this.getCurrent();
            if (typeof target.onLeave === 'function') {
                target.onLeave(getElementFromTarget(target.target));
            }
            this.current++;
            this.render(this.getCurrent());
        }
    }

    previous (): void {
        if (this.current !== 0) {
            const target = this.getCurrent();
            if (typeof target.onLeave === 'function') {
                target.onLeave(getElementFromTarget(target.target));
            }
            this.current--;
            this.render(this.getCurrent());
        }
    }

    setCurrentFirstIndex (): void {
        this.current = 0;
    }

    getCurrent (): TsEnjoyHintTargetOption {
        return this.hints[this.current];
    }

    render (target: TsEnjoyHintTargetOption): void {
        cleanCanvas({ canvas: this.canvas });
        if (typeof target.onEnter === 'function') {
            target.onEnter(getElementFromTarget(target.target));
        }
        canvasDrawer(this.canvas, target);
        resizeNonClickableStrokeToTarget(target.target, this.stroke);
        resizeLabel({ label: this.label, target });
    }

    resize (): void {
        const target = this.getCurrent();
        getTargetRect({ target: target.target, force: true });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render(target);
        resizeNonClickableStrokeToTarget(target.target, this.stroke);
    }
}

function isTsEnjoyHintTargetOption (option: TsEnjoyHintOptions): option is TsEnjoyHintTargetOption {
    return typeof option === 'object' && !(option instanceof HTMLElement) && 'target' in option;
}

type TsEnjoyHintTarget = string | Element;

type TsEnjoyHintCallback = (target: Element) => void;

type TsEnjoyHintShape = 'rectangle' | 'circle';

interface TsEnjoyHintTargetOption {
    target: TsEnjoyHintTarget;
    shape?: TsEnjoyHintShape;
    label?: string;
    nextEvent?: string;
    onEnter?: TsEnjoyHintCallback;
    onLeave?: TsEnjoyHintCallback;
}

type TsEnjoyHintOptions = TsEnjoyHintTarget | TsEnjoyHintTargetOption;

export { TypescriptEnjoyHint, type TsEnjoyHintOptions, type TsEnjoyHintShape, type TsEnjoyHintTarget, type TsEnjoyHintTargetOption };
