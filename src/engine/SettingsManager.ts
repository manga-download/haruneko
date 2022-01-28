import type { ResourceKey } from '../i18n/ILocale';
import type { StorageController } from './StorageController';

type IValue = string | boolean | number;

class Setting<T extends IValue> {

    private value: T;
    private readonly initial: T;
    private readonly name: ResourceKey;

    constructor(name: ResourceKey, initial: T) {
        this.name = name;
        this.value = initial;
        this.initial = initial;
    }

    public get Name(): ResourceKey {
        return this.name;
    }

    public get Value(): T {
        return this.value;
    }

    public set Value(value: T) {
        if(this.value !== value) {
            this.value = value;
            if(this.onValueChanged) {
                this.onValueChanged(this);
            }
        }
    }

    public get Default(): T {
        return this.initial;
    }

    private onValueChanged: (sender: typeof this) => Promise<void>;
    public set OnValueChanged(callback: typeof this.onValueChanged) {
        this.onValueChanged = callback;
    }
}

export class Text extends Setting<string> {

    constructor(name: ResourceKey, initial: string) {
        super(name, initial);
    }
}

export class Check extends Setting<boolean> {

    constructor(name: ResourceKey, initial: boolean) {
        super(name, initial);
    }
}

export class Choice extends Setting<string> {

    constructor(name: ResourceKey, initial: string, ...options: string[]) {
        super(name, initial);
        this.options = options;
    }

    private readonly options: string[];
    public get Options(): string[] {
        return this.options;
    }
}

export class Numeric extends Setting<number> {

    constructor(name: ResourceKey, initial: number, min: number, max: number) {
        super(name, initial);
        this.min = min;
        this.max = max;
    }

    public get Value(): number {
        return super.Value;
    }

    public set Value(value: number) {
        super.Value = Math.min(this.Max, Math.max(value, this.min));
    }

    private min: number;
    public get Min(): number {
        return this.min;
    }
    public set Min(min: number) {
        super.Value = Math.max(min, super.Value);
        this.min = min;
    }

    private max: number;
    public get Max(): number {
        return this.max;
    }
    public set Max(max: number) {
        super.Value = Math.min(max, super.Value);
        this.max = max;
    }
}

type ISetting = Setting<IValue>;

const prefix = 'settings.';

class Settings implements Iterable<ISetting> {

    private readonly scope: string;
    private readonly storage: StorageController;
    private readonly settings: Record<string, ISetting> = {};

    constructor(scope: string, storage: StorageController) {
        this.scope = prefix + scope;
        this.storage = storage;
    }

    public Register(key: string, setting: ISetting): typeof this {
        if(this.settings[key]) {
            // throw ?
        } else {
            this.settings[key] = setting;
            this.settings[key].OnValueChanged = this.OnValueChangedCallback.bind(this);
        }
        return this;
    }

    private async OnValueChangedCallback(sender: ISetting) {
        await this.Save();
        // TODO: Dispatch setting changed event?
        console.log(sender.Name, '=>', sender.Value);
    }

    public async Load(): Promise<void> {
        const data = await this.storage.LoadPersistent<Record<string, IValue>>(this.scope);
        for(const key in this.settings) {
            if(data && data[key]) {
                // TODO: prevent this.Save from being fired, e.g. detach OnChangeEvent temporary?
                this.settings[key].Value = data[key];
            }
        }
    }

    public async Save(): Promise<void> {
        const data: Record<string, IValue> = {};
        for(const key in this.settings) {
            data[key] = this.settings[key].Value;
        }
        await this.storage.SavePersistent(this.scope, data);
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
    public async OpenScope(scope: string): Promise<Settings> {
        return this.scopes[scope] || (this.scopes[scope] = new Settings(scope, this.storage));
    }
}