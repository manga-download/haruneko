import type { IValue, ISetting, ISettings, Numeric } from '../../../engine/SettingsManager';
import { InternalError } from '../../../engine/Error';

// Adapted source from : https://github.com/Rich-Harris/local-storage-test/blob/main/src/lib/storage.svelte.ts

/**
 *A generic store class for managing settings to handle svelte reactive updates.
 *
 *The `SettingStore` class provides a mechanism to wrap a setting object and
 *mirror its current engine value into Svelte 5 state so UI bindings stay
 *reactive in both directions.
 *
 *@typeParam V - The type of the value managed by the setting.
 *@typeParam S - The type of the setting object that implements the `ISetting<V>` interface.
 */
export class SettingStore<V extends IValue, S extends ISetting<V>> {
    readonly #setting: S;
    #value = $state() as V;

    constructor(setting: S) {
        this.#setting = setting;
        this.#value = setting.Value;
        this.#setting.Subscribe(value => {
            this.#value = value;
        });
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention -- existing public API used throughout Svelte bindings
    get setting(){
        return this.#setting;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention -- existing public API used throughout Svelte bindings
    get value():V {
        return this.#value;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention -- existing public API used throughout Svelte bindings
    set value(value: V) {
        this.#setting.Value = value;
        this.#value = this.#setting.Value;
    }
}

/**
 *A specialized store that extends `SettingStore` to manage numeric settings with
 *increment, decrement. This store enforces boundaries
 *for the value and allows for controlled adjustments.
 *
 *@typeParam V - The type of the value managed by the setting.
 *@typeParam S - The type of the setting that extends `ISetting<V>`.
 */
export class SettingCountStore extends SettingStore<number, Numeric> {
    readonly #increment: number;

    /**
     *Creates an instance of `SettingCountStore`.
     *
     *@param setting - The setting instance to be managed by the store.
     *@param increment - The step value to increment or decrement the setting.
     */
    constructor(setting: Numeric, increment: number) {
        super(setting);
        this.#increment = increment;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention -- existing public API used by the classic frontend
    increment (increment?: number) { this.value = this.value + (increment || this.#increment); }
    // eslint-disable-next-line @typescript-eslint/naming-convention -- existing public API used by the classic frontend
    decrement (increment?: number) { this.value = this.value - (increment || this.#increment); }
}

/**
 *Loads a setting from the provided scope and returns a `SettingStore` instance for it.
 *
 *@typeParam V - The type of the value associated with the setting.
 *@typeParam S - The type of the setting object that extends `ISetting<V>`.
 *
 *@param scope - The settings scope from which the setting will be retrieved.
 *@param settingKey - The key identifying the setting to be loaded.
 *
 *@returns A `SettingStore` instance for the specified setting.
 *
 *@throws \{InternalError\} If the setting with the given key does not exist in the provided scope.
 */
export function LoadSettingStore<V extends IValue, S extends ISetting<V>>(scope:ISettings, settingKey:string) : SettingStore<V, S> {
    const existingSetting: S = scope.Get(settingKey);
    if (!existingSetting) throw new InternalError(`Setting ${settingKey} in scope ${scope} does not exists`);
    return new SettingStore(existingSetting);
}
