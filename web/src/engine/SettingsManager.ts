import { type IResource, EngineResourceKey as R } from '../i18n/ILocale';
import { type StorageController, Store } from './StorageController';
import { Observable } from './Observable';
import { Scope } from './SettingsGlobal';
import { Exception } from './Error';

//const secret = 'E8463362D9B817D3956F054D01093EC6'; // MD5('simple.encryption.key.for.secret.settings')

function Encrypt(decrypted: string) {
    // TODO: Use some real encryption 😉
    return window.btoa(decrypted);
}

function Decrypt(encrypted: string) {
    // TODO: Use some real decryption 😉
    return window.atob(encrypted);
}

export type IValue = string | boolean | number | FileSystemDirectoryHandle;

class Setting<T extends IValue> extends Observable<T> {

    private readonly initial: T;

    constructor(private readonly id: string, private readonly label: keyof IResource, private readonly description: keyof IResource, initial: T) {
        super(initial);
        this.initial = initial;
    }

    public get ID(): string {
        return this.id;
    }

    public get Label(): keyof IResource {
        return this.label;
    }

    public get Description(): keyof IResource {
        return this.description;
    }

    public get Default(): T {
        return this.initial;
    }

    /**
     * Decode and assign the {@link Value} from a raw/encoded format.
     */
    public Deserialize(serialized: IValue) {
        this.Value = serialized as T;
    }

    /**
     * Get the {@link Value} in a raw/encoded format suitable for storage.
     */
    public Serialize(): IValue {
        return this.Value;
    }
}

export type ISetting<T extends IValue = IValue> = Setting<T>;

export class Text extends Setting<string> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: string) {
        super(id, label, description, initial);
    }
}

export class Secret extends Setting<string> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: string) {
        super(id, label, description, initial);
    }

    public override Deserialize(serialized: string): void {
        super.Value = Decrypt(serialized);
    }

    public override Serialize(): string {
        return Encrypt(super.Value);
    }
}

export class Check extends Setting<boolean> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: boolean) {
        super(id, label, description, initial);
    }
}

type IOption = { key: string, label: keyof IResource }

export class Choice extends Setting<string> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: string, ...options: IOption[]) {
        super(id, label, description, initial);
        this.options = options;
    }

    private NormalizeValue(value: string) {
        return this.options.some(option => option.key === value) ? value : super.Default;
    }

    public get Value(): string {
        return this.NormalizeValue(super.Value);
    }

    public set Value(value: string) {
        super.Value = this.NormalizeValue(value);
    }

    private readonly options: IOption[];
    public get Options(): IOption[] {
        return this.options;
    }
}

export class Numeric extends Setting<number> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: number, min: number, max: number) {
        super(id, label, description, initial);
        this.min = min;
        this.max = max;
    }

    private NormalizeValue(value: number) {
        return Math.min(this.Max, Math.max(value, this.Min));
    }

    public get Value(): number {
        return this.NormalizeValue(super.Value);
    }

    public set Value(value: number) {
        super.Value = this.NormalizeValue(value);
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

export class Directory extends Setting<FileSystemDirectoryHandle> {

    constructor(id: string, label: keyof IResource, description: keyof IResource, initial: FileSystemDirectoryHandle) {
        super(id, label, description, initial);
    }
}

class Settings implements Iterable<ISetting> {

    private readonly settings: Record<string, ISetting> = {};

    constructor(private readonly scope: string, private readonly storage: StorageController) {
    }

    /**
     * Notify subscribers and store the current values of all settings to the persistent storage.
     */
    private async SaveAllSettings() {
        const data: Record<string, IValue> = {};
        for(const key in this.settings) {
            data[key] = this.settings[key].Serialize();
        }
        await this.storage.SavePersistent(data, Store.Settings, this.scope);
    }

    /**
     * Configure all available settings and apply the stored values from the persistent storage.
     */
    public async Initialize(...settings: ISetting[]): Promise<void> {
        // TODO: May disable Initialize() to prevent breaking existing settings?
        const data = await this.storage.LoadPersistent<Record<string, IValue>>(Store.Settings, this.scope);
        for(const setting of settings) {
            if(!this.settings[setting.ID]) {
                if(data && data[setting.ID]) {
                    setting.Deserialize(data[setting.ID]);
                }
                setting.Subscribe(this.SaveAllSettings.bind(this));
                this.settings[setting.ID] = setting;
            }
        }
        // TODO: Can this just be ignored with a `Promise.resolve()` instead of raising an error?
        this.Initialize = () => Promise.reject(new Exception(R.SettingsManager_Settings_AlreadyInitializedError, this.scope));
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
     * If no scope identifier is provided, the global settings will be returned.
     */
    public OpenScope(scope?: string): ISettings {
        scope = scope || Scope;
        return this.scopes[scope] || (this.scopes[scope] = new Settings(scope, this.storage));
    }
}