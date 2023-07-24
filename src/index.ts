import { canvasDrawer, createFullScreenCanvas } from './utils/canvas.utils';
import { createLabel, resizeLabel } from './utils/label.utils';
import { createNonClickableStroke, getElementFromTarget, resizeNonClickableStrokeToTarget, type TsEnjoyHintNonClickableStokes } from './utils/options.utils';
import { getTargetRect } from './utils/rect.utils';

class TypescriptEnjoyHint {
    private current: number = 0;

    private canvas!: HTMLCanvasElement;
    private stroke!: TsEnjoyHintNonClickableStokes;
    private label!: HTMLDivElement;

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
            document.body.appendChild(this.canvas);
        }
        if (this.stroke === undefined) {
            this.stroke = createNonClickableStroke();
            document.body.appendChild(this.stroke.bottom);
            document.body.appendChild(this.stroke.left);
            document.body.appendChild(this.stroke.right);
            document.body.appendChild(this.stroke.top);
        }
        if (this.label === undefined) {
            this.label = createLabel();
            document.body.appendChild(this.label);
        }
        this.render(this.getCurrent());
        document.body.style.overflow = 'hidden';
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
        if (typeof target.onEnter === 'function') {
            target.onEnter(getElementFromTarget(target.target));
        }
        canvasDrawer(this.canvas, target);
        resizeNonClickableStrokeToTarget(target.target, this.stroke);
        resizeLabel({ label: this.label, target });
    }

    canvasResize (): void {
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
