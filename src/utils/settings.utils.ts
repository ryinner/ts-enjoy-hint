const tsEnjoyHintSettings: TsEnjoyHintGlobalSettings = {
    nextBtn: 'Next',
    nextBtnClass: 'ts-enjoy-hint-button--next',
    previousBtn: 'Previous',
    previousBtnClass: 'ts-enjoy-hint-button--previous',
    closeBtn: 'X',
    closeBtnClass: 'ts-enjoy-hint-button--close',
    zIndex: 10,
    scrollBehavior: 'smooth'
};

export function setSettings (settings: TsEnjoyHintGlobalSettings): void {
    Object.assign(tsEnjoyHintSettings, settings);
}

export function getSettings (): TsEnjoyHintGlobalSettings {
    return tsEnjoyHintSettings;
}

export interface TsEnjoyHintGlobalSettings {
    nextBtn: string;
    nextBtnClass: string;
    previousBtn: string;
    previousBtnClass: string;
    closeBtn: string;
    closeBtnClass: string;
    zIndex: number;
    scrollBehavior: ScrollBehavior;
}
