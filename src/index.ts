import { createButton } from './utils/button.utils';
import { canvasDrawer, cleanCanvas, createFullScreenCanvas } from './utils/canvas.utils';
import { createLabel, resizeLabel } from './utils/label.utils';
import { createNonClickableStroke, getElementFromTarget, resizeNonClickableStrokeToTarget, type TsEnjoyHintNonClickableStokes } from './utils/options.utils';
import { getSettings } from './utils/settings.utils';
import { throttle } from './utils/throttle.utils';

class TypescriptEnjoyHint {
    private _current!: number;

    private get current (): number {
        return this._current;
    }

    private set current (value: number) {
        this._current = value;
        const nextDisplay = this._current === 0 ? 'none' : 'initial';
        if (this.buttons.previous !== undefined) {
            this.buttons.previous.style.display = nextDisplay;
        }
    }

    private canvas!: HTMLCanvasElement;
    private stroke!: TsEnjoyHintNonClickableStokes;
    private label!: HTMLDivElement;
    private readonly buttons: { next?: HTMLButtonElement; close?: HTMLButtonElement; previous?: HTMLButtonElement } = {
        next: undefined,
        close: undefined,
        previous: undefined
    };

    private hints!: TsEnjoyHintTargetOption[];

    private resizeFunc!: ReturnType<typeof throttle>;

    apply (options: TsEnjoyHintOptions | TsEnjoyHintOptions[]): void {
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
        this.canvas = createFullScreenCanvas();
        document.body.appendChild(this.canvas);
        this.stroke = createNonClickableStroke();
        document.body.appendChild(this.stroke.bottom);
        document.body.appendChild(this.stroke.left);
        document.body.appendChild(this.stroke.right);
        document.body.appendChild(this.stroke.top);
        this.label = createLabel();
        const labelContent = this.label.children[0];
        if (this.buttons.next === undefined) {
            this.buttons.next = createButton({ text: getSettings().nextBtn });

            const nextFunc = this.next.bind(this);
            this.buttons.next.onclick = nextFunc;
            labelContent.appendChild(this.buttons.next);
        }
        if (this.buttons.previous === undefined) {
            this.buttons.previous = createButton({ text: getSettings().previousBtn });
            const previousFunc = this.previous.bind(this);
            this.buttons.previous.onclick = previousFunc;
            labelContent.appendChild(this.buttons.previous);
        }
        document.body.appendChild(this.label);
        this.setCurrentFirstIndex();
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
        document.body.style.overflow = 'initial';
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
