import logo from './Kitsu.png';
import { ResourceKey } from '../../i18n/ILocale';
import type { IMediaInfoTracker, Info, Suggestion, TrackingStatus } from './IMediaInfoTracker';
import { type SettingsManager, type ISettings , Text, Secret } from '../SettingsManager';
import { FetchJSON, FetchRequest } from '../FetchProvider';

type APIManga = {
    data: {
        attributes: {
            canonicalTitle: string
            titles: Record<string, string> // localized names
            description: string
            synopsis: string
            startDate: string // ISO string
            posterImage: {
                medium: string // URL
            }
        }
    }
};

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
        console.log('Kitsu.Search()', title);
        return [];
    }

    public async GetInfo(identifier: string): Promise<Info> {
        identifier = '/manga/35';
        const data = await FetchJSON<APIManga>(new FetchRequest(this.endpoint + identifier));
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
        console.log('Kitsu.GetStatus()', identifier);
        throw new Error('Method not implemented.');
    }

    public async SetStatus(identifier: string, status: TrackingStatus): Promise<void> {
        console.log('Kitsu.SetStatus()', identifier, status);
        throw new Error('Method not implemented.');
    }
}