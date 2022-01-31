import type { ResourceKey } from '../i18n/ILocale';
import type { StorageController } from './StorageController';
import { Event } from './EventManager';
import { GetLocale } from '../i18n/Localization';

const prefix = 'settings.';
//const secret = 'E8463362D9B817D3956F054D01093EC6'; // MD5('simple.encryption.key.for.secret.settings')

function Encrypt(decrypted: string) {
    // TODO: Use some real encryption 😉
    return window.btoa(decrypted);
}

function Decrypt(encrypted: string) {
    // TODO: Use some real decryption 😉
    return window.atob(encrypted);
}

export type IValue = string | boolean | number;

class Setting<T extends IValue> {

    public value: T;
    private readonly initial: T;
    private readonly id: string;
    private readonly label: ResourceKey;
    private readonly description: ResourceKey;

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: T) {
        this.id = id;
        this.label = label;
        this.description = description;
        this.value = initial;
        this.initial = initial;
    }

    public readonly ValueChanged: Event<typeof this, T> = new Event<typeof this, T>();

    public get ID(): string {
        return this.id;
    }

    public get Label(): ResourceKey {
        return this.label;
    }

    public get Description(): ResourceKey {
        return this.description;
    }

    public get Value(): T {
        return this.value;
    }

    /**
     * Assign a new value and also dispatch the {@link ValueChanged} event to notify all subscribers.
     */
    public set Value(value: T) {
        if(this.value !== value) {
            this.value = value;
            this.ValueChanged.Dispatch(this, this.Value);
        }
    }

    public get Default(): T {
        return this.initial;
    }
}

export type { Setting };

export class Text extends Setting<string> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: string) {
        super(id, label, description, initial);
    }
}

export class Secret extends Setting<string> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: string) {
        super(id, label, description, Encrypt(initial));
    }

    public get Value(): string {
        return Decrypt(super.Value);
    }

    public set Value(value: string) {
        super.Value = Encrypt(value);
    }
}

export class Check extends Setting<boolean> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: boolean) {
        super(id, label, description, initial);
    }
}

type IOption = { key: string, label: ResourceKey }

export class Choice extends Setting<string> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: string, ...options: IOption[]) {
        super(id, label, description, initial);
        this.options = options;
    }

    public get Value(): string {
        return this.options.some(option => option.key === super.Value) ? super.Value : super.Default;
    }

    public set Value(value: string) {
        super.Value = value;
    }

    private readonly options: IOption[];
    public get Options(): IOption[] {
        return this.options;
    }
}

export class Numeric extends Setting<number> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: number, min: number, max: number) {
        super(id, label, description, initial);
        this.min = min;
        this.max = max;
    }

    public get Value(): number {
        // NOTE: Get the capped value considering min/max range
        return Math.min(this.Max, Math.max(super.Value, this.Min));
    }

    public set Value(value: number) {
        // NOTE: Set the 'raw' value that may be outside the range of min/max
        super.Value = value;
    }

    private min: number;
    public get Min(): number {
        return this.min;
    }

    private max: number;
    public get Max(): number {
        return this.max;
    }
}

export class Path extends Setting<string> {

    constructor(id: string, label: ResourceKey, description: ResourceKey, initial: string) {
        super(id, label, description, initial);
    }
}

type ISetting = Setting<IValue>;

class Settings implements Iterable<ISetting> {

    private readonly scope: string;
    private readonly storage: StorageController;
    private readonly settings: Record<string, ISetting> = {};

    constructor(scope: string, storage: StorageController) {
        this.scope = prefix + scope;
        this.storage = storage;
    }

    public readonly ValueChanged: Event<ISetting, IValue> = new Event<ISetting, IValue>();

    /**
     * Notify subscribers and store the current values of all settings to the persistent storage.
     */
    private async OnValueChangedCallback(sender: ISetting, args: IValue) {
        this.ValueChanged.Dispatch(sender, args);
        const data: Record<string, IValue> = {};
        for(const key in this.settings) {
            data[key] = this.settings[key].value;
        }
        await this.storage.SavePersistent(this.scope, data);
    }

    /**
     * Configure all available settings and apply the stored values from the persistent storage.
     */
    public async Initialize(...settings: ISetting[]): Promise<void> {
        // TODO: May disable Initialize() to prevent breaking existing settings?
        const data = await this.storage.LoadPersistent<Record<string, IValue>>(this.scope);
        for(const setting of settings) {
            if(!this.settings[setting.ID]) {
                setting.value = data && data[setting.ID] ? data[setting.ID] : setting.Value;
                setting.ValueChanged.Subscribe(this.OnValueChangedCallback.bind(this));
                this.settings[setting.ID] = setting;
            }
        }
        this.Initialize = () => Promise.reject(new Error(GetLocale().SettingsManager_Settings_AlreadyInitializedError(this.scope)));
    }

    /**
     * Get the setting for a certain key.
     */
    public Get<T extends ISetting>(key: string): T {
        return this.settings[key] as T;
    }

    *[Symbol.iterator]()/*: Iterator<ISetting>*/ {
        for(const key in this.settings) {
            yield this.settings[key];
        }
    }
}

export type ISettings = Settings;

export class SettingsManager {

    private readonly storage: StorageController;
    private readonly scopes: Record<string, Settings> = {};

    constructor(storage: StorageController) {
        this.storage = storage;
    }

    /**
     * Get the settings for the given scope, or creates new settings if the scope not yet exists.
     */
    public OpenScope(scope: string): ISettings {
        return this.scopes[scope] || (this.scopes[scope] = new Settings(scope, this.storage));
    }
}