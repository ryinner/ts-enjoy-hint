export function createButton ({ text, class: buttonClass }: { text: string; class?: string }): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('ts-enjoy-hint-button');

    if (typeof buttonClass === 'string') {
        button.classList.add(buttonClass);
    }

    button.textContent = text;

    return button;
}
