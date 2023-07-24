export function throttle <F extends (...args: any) => any> (fn: F, timeout: number = 3000): (args: Parameters<F>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;

    return function perform (...args) {
        if (timer !== null) {
            return;
        }

        timer = setTimeout(() => {
            fn(...args);
            clearTimeout(<ReturnType<typeof setTimeout>> timer);
            timer = null;
        }, timeout);
    };
}
