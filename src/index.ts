import { createButton } from './utils/button.utils';
import { canvasDrawer, cleanCanvas, createFullScreenCanvas, paintGrayCanvas } from './utils/canvas.utils';
import { createLabel, resizeLabel } from './utils/label.utils';
import { createNonClickableStroke, getElementFromTarget, resizeNonClickableStrokeToTarget, type TsEnjoyHintNonClickableStokes } from './utils/options.utils';
import { getTargetRect } from './utils/rect.utils';
import { getSettings, setSettings } from './utils/settings.utils';
import { throttle } from './utils/throttle.utils';
import { isElementInViewport } from './utils/visability.utils';

class TsEnjoyHint {
    private _current!: number;

    private get current (): number {
        return this._current;
    }

    private set current (value: number) {
        this._current = value;
        const previousDisplay = this._current === 0 ? 'none' : 'initial';
        if (this.buttons.previous !== undefined) {
            this.buttons.previous.style.display = previousDisplay;
        }
        const target = this.getCurrent();
        const nextDisplay = target.nextEvent !== undefined ? 'none' : 'initial';
        if (this.buttons.next !== undefined) {
            this.buttons.next.style.display = nextDisplay;
        }
    }

    private isOpen: boolean = false;

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

    public apply (options: TsEnjoyHintOptions | TsEnjoyHintOptions[]): void {
        const arrayOptions = !Array.isArray(options) ? [options] : options;

        const parsedOptions = arrayOptions.map(optionUnknown => {
            if (!isTsEnjoyHintTargetOption(optionUnknown)) {
                return { target: optionUnknown };
            }
            return optionUnknown;
        });

        this.hints = parsedOptions;
    }

    public open (): void {
        if (this.isOpen) {
            return;
        }
        this.isOpen = true;
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
            this.buttons.next = createButton({ text: getSettings().nextBtn, class: getSettings().nextBtnClass });
            const nextFunc = this.next.bind(this);
            this.buttons.next.onclick = nextFunc;
        }
        labelContent.appendChild(this.buttons.next);
        if (this.buttons.previous === undefined) {
            this.buttons.previous = createButton({ text: getSettings().previousBtn, class: getSettings().previousBtnClass });
            const previousFunc = this.previous.bind(this);
            this.buttons.previous.onclick = previousFunc;
        }
        labelContent.appendChild(this.buttons.previous);
        if (this.buttons.close === undefined) {
            this.buttons.close = createButton({ text: getSettings().closeBtn, class: getSettings().closeBtnClass });
            const closeFunc = this.close.bind(this);
            this.buttons.close.onclick = closeFunc;
        }
        document.body.appendChild(this.buttons.close);
        document.body.appendChild(this.label);
        this.setCurrentFirstIndex();
        this.render(this.getCurrent());
        document.body.style.overflow = 'hidden';
        const resizeFunc = throttle(this.resize.bind(this), 100);
        this.resizeFunc = resizeFunc;
        window.addEventListener('resize', this.resizeFunc);
    }

    public close (): void {
        this.isOpen = true;
        window.removeEventListener('resize', this.resizeFunc);
        document.body.removeChild(this.canvas);
        document.body.removeChild(this.label);
        document.body.removeChild(this.stroke.bottom);
        document.body.removeChild(this.stroke.left);
        document.body.removeChild(this.stroke.right);
        document.body.removeChild(this.stroke.top);
        if (this.buttons.close !== undefined) {
            document.body.removeChild(this.buttons.close);
        }
        document.body.style.overflow = 'initial';
    }

    private next (): void {
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

    private previous (): void {
        if (this.current !== 0) {
            const target = this.getCurrent();
            if (typeof target.onLeave === 'function') {
                target.onLeave(getElementFromTarget(target.target));
            }
            this.current--;
            this.render(this.getCurrent());
        }
    }

    private setCurrentFirstIndex (): void {
        this.current = 0;
    }

    private getCurrent (): TsEnjoyHintTargetOption {
        return this.hints[this.current];
    }

    private render (target: TsEnjoyHintTargetOption): void {
        paintGrayCanvas({ canvas: this.canvas });
        if (typeof target.onEnter === 'function') {
            target.onEnter(getElementFromTarget(target.target));
        }
        const render = ({ force }: { force: boolean }): void => {
            getTargetRect({ target: target.target, force });
            cleanCanvas({ canvas: this.canvas });
            canvasDrawer(this.canvas, target);
            resizeNonClickableStrokeToTarget(target.target, this.stroke);
            resizeLabel({ label: this.label, target });
            this.label.style.opacity = 'initial';

            if (target.nextEvent !== undefined) {
                const element = getElementFromTarget(target.target);
                const nextFunc = this.next.bind(this);
                const eventHandler = (): void => {
                    nextFunc();
                    element.removeEventListener(<string> target.nextEvent, eventHandler);
                };
                element.addEventListener(target.nextEvent, eventHandler);
            }
        };

        if (!isElementInViewport({ target: target.target })) {
            this.label.style.opacity = '0';
            const element = getElementFromTarget(target.target);
            let intersectionObserver: IntersectionObserver | undefined = new IntersectionObserver((entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        render({ force: true });
                    }, 300);
                    if (intersectionObserver !== undefined) {
                        intersectionObserver.disconnect();
                    }
                    intersectionObserver = undefined;
                }
            });
            intersectionObserver.observe(element);
            element.scrollIntoView({ behavior: getSettings().scrollBehavior, block: 'center', inline: 'nearest' });
        } else {
            render({ force: false });
        }
    }

    private resize (): void {
        const target = this.getCurrent();
        getTargetRect({ target: target.target, force: true });
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render(target);
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

export { TsEnjoyHint, setSettings as TsEnjoyHintSetSettings, type TsEnjoyHintOptions, type TsEnjoyHintShape, type TsEnjoyHintTarget, type TsEnjoyHintTargetOption };
