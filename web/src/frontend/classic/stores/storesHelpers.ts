import { type Writable, writable } from 'svelte/store';
import type { IValue, ISetting} from '../../../engine/SettingsManager';
import type { Key } from '../../../engine/SettingsGlobal';
import { InternalError } from '../../../engine/Error';

const globalsettings = HakuNeko.SettingsManager.OpenScope();

interface SettingStore<V extends IValue, S extends ISetting<V>> extends Writable<V> {
    setting: S,
    reset() : void
}

/**
 * Create a writable svelte store that is coupled with the given setting
 * and updated whenever the value of the underlying setting is changed.
 * @param setting - a specific setting of the frontend
 */
export function CreateSettingStore<V extends IValue, S extends ISetting<V>>(setting: S) : SettingStore<V, S> {
    const { subscribe, set, update } = writable(setting.Default);

    setting.Subscribe(value => set(value));

    return {
        subscribe,
        update,
        set: (value: V) => { setting.Value = value; set(value); },
        reset: () => {
            setting.Value = setting.Default;
            set(setting.Default);
        },
        setting: setting
    };
}

/**
 * Create a writable svelte store that is coupled with the given setting in the global scope
 * and updated whenever the value of the underlying setting is changed.
 * @param settingKey - an existing key (created in the engine)
 */
export function CreateExistingSettingStore<V extends IValue, S extends ISetting<V>>(settingKey: Key) : SettingStore<V, S> {
    const setting: S = globalsettings.Get(settingKey);
    if (!setting) throw new InternalError(`Setting ${settingKey} does not exists`);
    return CreateSettingStore<V, S>(setting);
}

interface SettingCountStore extends Writable<number> {
    increment(): void,
    decrement(): void,
    reset(): void,
}

/**
 * Create a writable svelte store that is used to retain number values
 * and updated whenever the value of the underlying setting is changed.
 * @param initialValue - value on creation
 * @param increment - step size when incrementing/decrementing
 * @param minimum - lowest value
 * @param maximum - highest value
 */
export function CreateCountStore(initialValue: number, increment: number, minimum = -Infinity, maximum = Infinity) : SettingCountStore {
    const { subscribe, set, update } = writable(initialValue);

    return {
        subscribe,
        set,
        update,
        increment: () => update(n => Math.min(maximum, n + increment)),
        decrement: () => update(n => Math.max(minimum, n - increment)),
        reset: () => set(initialValue)
    };
}