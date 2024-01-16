import logo from './Kitsu.webp';
import poster from '../../img/media.webp';
import { TrackerResourceKey as R } from '../../i18n/ILocale';
import { type MediaInfoTracker, type Info, MediaType, type TrackingStatus } from './IMediaInfoTracker';
import { type SettingsManager, type ISettings, Text, Secret } from '../SettingsManager';
import { FetchJSON } from '../platform/FetchProvider';
import { NotImplementedError } from '../Error';

type APIMediaAttributes = {
    id: string
    type: MediaType
    attributes: {
        subtype: string
        canonicalTitle: string
        titles: Record<string, string> // localized names
        description?: string
        synopsis?: string
        startDate: string // ISO string
        posterImage: {
            small: string // URL
        }
    }
}

type APIMedia = {
    data: APIMediaAttributes
};

type APIAlgoliaKeys = {
    media: {
        index: string
        key: string
    }
}

type APIAlgoliaSearch = {
    page: number
    nbPages: number
    hits: {
        id: number
        kind: MediaType
        subtype: string
        canonicalTitle: string
        titles: Record<string, string> // localized names
        description?: { en?: string }
        synopsis?: string
        startDate: number // timestamp
        posterImage: {
            small: string // URL
        }
    }[];
}

export class Kitsu implements MediaInfoTracker {

    private readonly endpoint = 'https://kitsu.io/api/edge';
    public readonly Identifier: string = 'kitsu';
    public readonly Title: string = 'Kitsu';

    private readonly settings: ISettings;
    private readonly username = new Text('username', R.Tracker_Kitsu_Settings_Username, R.Tracker_Kitsu_Settings_UsernameInfo, '');
    private readonly password = new Secret('password', R.Tracker_Kitsu_Settings_Password, R.Tracker_Kitsu_Settings_PasswordInfo, '');

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
        throw new NotImplementedError();
    }

    public async Search(title: string): Promise<Info[]> {
        const { media: { index, key } } = await FetchJSON<APIAlgoliaKeys>(new Request(this.endpoint + '/algolia-keys'));
        const uri = new URL(`https://awqo5j657s-dsn.algolia.net/1/indexes/${index}/query`);
        uri.searchParams.set('x-algolia-agent', 'Algolia for vanilla JavaScript (lite) 3.24.12');
        uri.searchParams.set('x-algolia-application-id', 'AWQO5J657S');
        uri.searchParams.set('x-algolia-api-key', key);
        const request = new Request(uri.href, {
            method: 'POST',
            headers: {
                'Referer': 'https://kitsu.io/',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: JSON.stringify({
                params: new URLSearchParams({
                    query: title,
                    attributesToRetrieve: '["id","kind","subtype","canonicalTitle","titles","posterImage","startDate","synopsis","description"]',
                    hitsPerPage: '250',
                    queryLanguages: '["en","ja"]',
                    naturalLanguages: '["en","ja"]',
                    attributesToHighlight: '[]',
                    responseFields: '["hits","page","nbPages"]',
                    removeStopWords: 'false',
                    removeWordsIfNoResults: 'allOptional'
                }).toString()
            })
        });

        const { hits } = await FetchJSON<APIAlgoliaSearch>(request);
        return hits.map(hit => {
            return {
                Identifier: `/${hit.kind}/${hit.id}`,
                Type: hit.subtype === 'novel' ? MediaType.Novel : hit.kind,
                Title: hit.canonicalTitle,
                Titles: Object.values(hit.titles),
                Cover: hit.posterImage?.small || poster,
                Creator: '',
                Released: new Date(hit.startDate),
                Description: hit.synopsis?.trim() || hit.description?.en?.trim() || '-',
            };
        });
    }

    public async GetInfo(identifier: string): Promise<Info> {
        const { data: { type, attributes } } = await FetchJSON<APIMedia>(new Request(this.endpoint + identifier));
        return {
            Identifier: identifier,
            Type: attributes.subtype === 'novel' ? MediaType.Novel : type,
            Title: attributes.canonicalTitle,
            Titles: Object.values(attributes.titles),
            Cover: attributes.posterImage?.small || poster,
            Creator: '',
            Released: new Date(attributes.startDate),
            Description: attributes.synopsis?.trim() || attributes.description?.trim() || '-',
        };
    }

    public async GetStatus(identifier: string): Promise<TrackingStatus> {
        console.log('Kitsu.GetStatus()', identifier);
        throw new NotImplementedError();
    }

    public async SetStatus(identifier: string, status: TrackingStatus): Promise<void> {
        console.log('Kitsu.SetStatus()', identifier, status);
        throw new NotImplementedError();
    }
}