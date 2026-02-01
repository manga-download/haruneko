import type { IValue, ISetting, ISettings} from '../../../engine/SettingsManager';
import { Numeric } from '../../../engine/SettingsManager';
import { InternalError } from '../../../engine/Error';

// Adapted source from : https://github.com/Rich-Harris/local-storage-test/blob/main/src/lib/storage.svelte.ts

/**
 * A generic store class for managing settings to handle svelte reactive updates.
 * 
 * The `SettingStore` class provides a mechanism to wrap a setting object and
 * enable reactive updates to its value. It uses proxies to track changes to
 * nested properties and ensures that updates are propagated to the underlying
 * setting object.
 * 
 * @template V - The type of the value managed by the setting.
 * @template S - The type of the setting object that implements the `ISetting<V>` interface.
 */
export class SettingStore<V extends IValue, S extends ISetting<V>> {
    readonly _setting: S;
    _version = $state(0);

	constructor(setting: S) {
        this._setting = setting;
        this._setting.Subscribe(value => { 
            this._version += 1;
            this.value = value
        });
	}

    get setting(){
        return this._setting;
    }

	get value():V {
        this._version;
		const proxies = new WeakMap();

		const proxy = (value: unknown) => {
			if (typeof value !== 'object' || value === null) {
				return value;
			}

			let p = proxies.get(value);

			if (!p) {
				p = new Proxy(value, {
					get: (target, property) => {
                        this._version;
						return proxy(Reflect.get(target, property));
					},
					set: (target, property, value) => {
                        this._version += 1;
						Reflect.set(target, property, value);
						this.setting.Value = value;
						return true;
					}
				});
				proxies.set(value, p);
			}
			return p;
		};

		return proxy(this._setting.Value);
	}

	set value(value) {
        this._version += 1;
		this._setting.Value = value;
	}
}

/**
 * A specialized store class that extends `SettingStore` to provide persistence
 * and automatic versioning for a given setting. The store listens for changes
 * in the setting's value and updates its internal state and version accordingly.
 *
 * @template V - The type of the value managed by the setting.
 * @template S - The type of the setting, which must extend `ISetting<V>`.
 *
 * @extends SettingStore<V, S>
 */
export class SettingPersistentStore<V extends IValue, S extends ISetting<V>> extends SettingStore<V,S> {

	constructor(setting: S) {
        super(setting);
        this._setting.Subscribe(value => { 
            this._version += 1;
            this.value = value
        });
	}
}

/**
 * A specialized store that extends `SettingStore` to manage numeric settings with
 * increment, decrement. This store enforces boundaries
 * for the value and allows for controlled adjustments.
 *
 * @template V - The type of the value managed by the setting.
 * @template S - The type of the setting that extends `ISetting<V>`.
 */
export class SettingCountStore extends SettingStore<number,Numeric> {
    readonly #increment: number;

    /**
     * Creates an instance of `SettingCountStore`.
     *
     * @param setting - The setting instance to be managed by the store.
     * @param increment - The step value to increment or decrement the setting.
     */
	constructor(setting: Numeric, increment: number) {
        super(setting);
        this.#increment = increment;

	}

    increment (increment?:number) { this.value = this.value + (increment || this.#increment) }
    decrement (increment?:number) { this.value = this.value - (increment || this.#increment) }
}

/**
 * Loads a setting from the provided scope and returns a `SettingStore` instance for it.
 *
 * @template V - The type of the value associated with the setting.
 * @template S - The type of the setting object that extends `ISetting<V>`.
 * 
 * @param scope - The settings scope from which the setting will be retrieved.
 * @param settingKey - The key identifying the setting to be loaded.
 * 
 * @returns A `SettingStore` instance for the specified setting.
 * 
 * @throws {InternalError} If the setting with the given key does not exist in the provided scope.
 */
export function LoadSettingStore<V extends IValue, S extends ISetting<V>>(scope:ISettings, settingKey:string) : SettingStore<V,S> {
    const existingSetting: S = scope.Get(settingKey);
    if (!existingSetting) throw new InternalError(`Setting ${settingKey} in scope ${scope} does not exists`);
    return new SettingStore(existingSetting)
}