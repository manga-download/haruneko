import type { IValue, ISetting, ISettings, Numeric } from '../../../engine/SettingsManager';
import { InternalError } from '../../../engine/Error';

/**
 * Reactive wrapper around a setting instance.
 *
 * The `SettingStore` class provides a mechanism to wrap a setting object and
 * enable reactive updates to its value. It mirrors the setting's value and
 * ensures that updates are propagated bidirectionally between the store and
 * the underlying setting object.
 *
 * @typeParam V - The type of the value managed by the setting.
 * @typeParam S - The type of the setting object that implements the `ISetting<V>` interface.
 */
export class SettingStore<V extends IValue, S extends ISetting<V>> {
    readonly #setting: S;
    #value = $state() as V;

    constructor(setting: S) {
        this.#setting = setting;
        this.#value = setting.Value;
        this.#setting.Subscribe(value => {
            if(value !== this.Value) this.Value = value;
        });
    }

    get Setting(){
        return this.#setting;
    }

    get Value():V {
        return this.#value;
    }

    set Value(value: V) {
        this.#setting.Value = value;
        this.#value = this.#setting.Value;
    }
}

/**
 * Numeric store with convenience operations.
 *
 * `SettingCountStore` extends `SettingStore` and adds methods to increment,
 * decrement, and reset the numeric value. The step amount is configurable
 * through `increment`.
 *
 * @typeParam V - The type of the value managed by the setting.
 * @typeParam S - The type of the setting that extends `ISetting<V>`.
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

    Increment (increment?: number) { this.Value = this.Value + (increment ?? this.#increment); }
    Decrement (increment?: number) { this.Value = this.Value - (increment ?? this.#increment); }
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
 *@throws {@link InternalError} If the setting with the given key does not exist in the provided scope.
 */
export function LoadSettingStore<V extends IValue, S extends ISetting<V>>(scope:ISettings, settingKey:string) : SettingStore<V, S> {
    const existingSetting: S = scope.Get(settingKey);
    if (!existingSetting) throw new InternalError(`Setting ${settingKey} does not exist in the provided scope`);
    return new SettingStore(existingSetting);
}
