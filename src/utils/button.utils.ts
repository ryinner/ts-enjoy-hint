export function createButton ({ text }: { text: string }): HTMLButtonElement {
    const button = document.createElement('button');
    button.classList.add('ts-enjoy-hint-button');

    button.textContent = text;

    return button;
}
