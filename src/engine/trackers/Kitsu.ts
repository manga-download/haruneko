import logo from './Kitsu.png';
import { ResourceKey } from '../../i18n/ILocale';
import type { IMediaInfoTracker, Info, Suggestion, TrackingStatus } from '../providers/IMediaInfoTracker';
import { type SettingsManager, type ISettings , Text, Secret } from '../SettingsManager';
import { FetchJSON, FetchRequest } from '../FetchProvider';

export class Kitsu implements IMediaInfoTracker {

    private readonly endpoint = 'https://kitsu.io/api/edge';
    public readonly Identifier: string = 'kitsu';
    public readonly Title: string = 'Kitsu';

    private readonly settings: ISettings;
    private readonly username = new Text('username', ResourceKey.Plugin_SheepScanlations_Settings_Username, ResourceKey.Plugin_SheepScanlations_Settings_UsernameInfo, '');
    private readonly password = new Secret('password', ResourceKey.Plugin_SheepScanlations_Settings_Password, ResourceKey.Plugin_SheepScanlations_Settings_PasswordInfo, '');

    constructor(private readonly settingsManager: SettingsManager) {
        this.settings = this.settingsManager.OpenScope(`tracker.${this.Identifier}`);
        this.settings.Initialize(this.username, this.password);
    }

    public get Icon(): string {
        return logo;
    }

    public get Settings(): ISettings {
        return this.settings;
    }

    public async Login(): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    public Search(title: string): Suggestion[] {
        // https://kitsu.io/api/edge/manga?filter[text]=${text}&page[limit]=20
        return [];
    }

    public async GetInfo(identifier: string): Promise<Info> {
        identifier = '/manga/35';
        const data = await FetchJSON<any>(new FetchRequest(this.endpoint + identifier));
        const attributes = data.data.attributes;
        return {
            Identifier: identifier,
            Title: attributes.canonicalTitle,
            Titles: Object.values(attributes.titles),
            Cover: attributes.posterImage.medium,
            Creator: '',
            Released: new Date(attributes.startDate),
            Description: attributes.synopsis || attributes.description,
        };
    }

    public async GetStatus(identifier: string): Promise<TrackingStatus> {
        throw new Error('Method not implemented.');
    }

    public async SetStatus(identifier: string, status: TrackingStatus): Promise<void> {
        throw new Error('Method not implemented.');
    }
}