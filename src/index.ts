type TsEnjoyHintTarget = string | HTMLElement;

type TsEnjoyHintCallback = (target: HTMLElement) => void;

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

    }

    close (): void {

    }

    next (): void {
        if (this.current === this.hints.length) {
            this.close();
        } else {
            this.current++;
        }
    }
}

function isTsEnjoyHintTargetOption (option: TsEnjoyHintOptions): option is TsEnjoyHintTargetOption {
    return typeof option === 'object' && !(option instanceof HTMLElement) && 'target' in option;
}

export { TypescriptEnjoyHint, type TsEnjoyHintOptions, type TsEnjoyHintShape, type TsEnjoyHintTarget, type TsEnjoyHintTargetOption };
