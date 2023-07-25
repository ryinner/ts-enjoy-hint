const tsEnjoyHintSettings: TsEnjoyHintGlobalSettings = {
    nextBtn: 'Next',
    previousBtn: 'Previous'
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
}
