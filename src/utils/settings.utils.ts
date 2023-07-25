const tsEnjoyHintSettings: TsEnjoyHintGlobalSettings = {
    nextBtn: 'Next',
    previousBtn: 'Previous',
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
    previousBtn: string;
    scrollBehavior: ScrollBehavior;
}
