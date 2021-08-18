export type SettingExtras = (() => void) | undefined
export type SettingValidator = ((value: any) => boolean) | undefined
export type SettingValue = string | number | boolean;

export const onSettingChange = (
    key: string,
    value: SettingValue,
    extras: SettingExtras,
    validator: SettingValidator
): boolean => {
    if (!validator || (validator && validator(value))) {
        localStorage.setItem(key, value.toString());
        if (extras) {
            extras();
        }

        return true
    }

    return false
}

export const getSettingDefaultValue = (key: string, defaultValue: SettingValue) => {
    return localStorage.getItem(key) ?? defaultValue;
}

// We need to do this because the default value can be a regular boolean or boolean "as string" (if we get the value from localStorage)
// The problem is we can't type cast localStorage (Ex: "false" as boolean = true) value easely so we need to do this
export const castBooleanSetting = (settingValue: SettingValue): boolean => settingValue === "true" || settingValue === true;

export const storageKeys = {
    DEMO_TOGGLE: "DEMO_TOGGLE",
    SHOW_CONTENT_PANEL: "SHOW_CONTENT_PANEL"
}
