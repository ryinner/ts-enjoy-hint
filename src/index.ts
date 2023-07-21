import { canvasDrawer, createFullScreenCanvas } from './utils/canvas.utils';
import { getElementFromTarget } from './utils/options.utils';

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

class TypescriptEnjoyHint {
    private current: number = 0;

    private canvas!: HTMLCanvasElement;

    private hints!: TsEnjoyHintTargetOption[];

    apply (options: TsEnjoyHintOptions | TsEnjoyHintOptions[]): void {
        this.close();
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
        }
        document.body.appendChild(this.canvas);
        this.render(this.getCurrent());
        window.addEventListener('resize', () => { this.canvasResize(); });
    }

    close (): void {
        window.removeEventListener('resize', () => { this.canvasResize(); });
    }

    next (): void {
        if (this.current === this.hints.length) {
            this.close();
        } else {
            const target = this.getCurrent();
            if (typeof target.onLeave === 'function') {
                target.onLeave(getElementFromTarget(target.target));
            }
            this.current++;
        }
    }

    setCurrentFirstIndex (): void {
        this.current = 0;
    }

    getCurrent (): TsEnjoyHintTargetOption {
        return this.hints[this.current];
    }

    render (target: TsEnjoyHintTargetOption): void {
        if (typeof target.onEnter === 'function') {
            target.onEnter(getElementFromTarget(target.target));
        }
        canvasDrawer(this.canvas, target);
    }

    canvasResize (): void {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.render(this.getCurrent());
    }
}

function isTsEnjoyHintTargetOption (option: TsEnjoyHintOptions): option is TsEnjoyHintTargetOption {
    return typeof option === 'object' && !(option instanceof HTMLElement) && 'target' in option;
}

export { TypescriptEnjoyHint, type TsEnjoyHintOptions, type TsEnjoyHintShape, type TsEnjoyHintTarget, type TsEnjoyHintTargetOption };
