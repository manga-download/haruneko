import { writable } from 'svelte/store';
import type { IValue, Setting} from '../../../engine/SettingsManager';
import type { Key } from '../../../engine/SettingsGlobal';

const globalsettings = HakuNeko.SettingsManager.OpenScope();

/**
 * Create a writable svelte store that is coupled with the given setting
 * and updated whenever the value of the underlying setting is changed.
 * @param setting - a specific setting of the frontend
 */
export function CreateWritableStore<T extends IValue>(setting:Setting<T>) {
    const { subscribe, set } = writable(setting.Default);

    setting.ValueChanged.Subscribe(
        (_: typeof setting, value: T) => set(value)
    );
    return {
        subscribe,
        set: (value: T) => { setting.Value = value; set(value); },
        reset: () => { setting.Value = setting.Default; set(setting.Default); },
        setting : setting
    };
}

/**
 * Create a writable svelte store that is coupled with the given setting
 * and updated whenever the value of the underlying setting is changed.
 * @param settingKey - an existing key (created in the engine)
 */
export function GetEngineSetting<T extends IValue>(settingKey: Key) {
    const setting: Setting<T> = globalsettings.Get(settingKey);
    if (!setting) throw new Error(`Setting ${settingKey} does not exists`);
    return CreateWritableStore<T>(setting);
}

export function CreateCountStore(initialValue:number, increment:number,minimum = -Infinity, maximum = Infinity) {
    const { subscribe, set, update } = writable(initialValue);

    return {
        subscribe,
        set,
        increment: () => update(n => n + increment <= maximum ? n + increment : n),
        decrement: () => update(n => n - increment >= minimum ? n - increment : n),
        reset: () => set(initialValue)
    };
}