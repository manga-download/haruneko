import { Delay } from '../BackgroundTimers';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';
import { FetchJSON, FetchGraphQL, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import * as Common from './decorators/Common';

// TODO: Check for possible revision

type APIEncryptedResult = {
    tobeparsed?: string;
};

type APIResult<T> = {
    data: T & APIEncryptedResult;
};

type APIMangas = {
    mangas: {
        edges: {
            _id: string;
            name: string;
            englishName: string | null;
        }[];
    };
};

type APIChapters = {
    episodeInfos: {
        episodeIdNum: number;
        notes?: string;
    }[];
    manga: {
        availableChaptersDetail: {
            raw: string[];
            sub: string[];
        }
    };
};

type APIPages = {
    chapterPages: {
        edges: {
            pictureUrlHead: string;
            pictureUrls: {
                url: string;
            }[];
        }[];
    };
};

type ChapterID = {
    id: string;
    translationType: string;
};

@Common.MangaCSS<HTMLUListElement>(/^{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type', (li, uri) => ({ id: uri.href.split('/').at(-1), title: li.innerText.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.allanime.day/api';

    public constructor() {
        super('allmanga', 'AllManga.to', 'https://allmanga.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/manga/-', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        // TODO: Use Array.fromAsync
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(200);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        // TODO: Use FetchGraphQL
        const data = await this.FetchAPI<APIMangas>(`
            query ($page: Int) {
                mangas(
                    search: {
                        isManga: true
                        allowAdult: true
                        allowUnknown: false
                    }
                    page: $page
                    limit: 20
                    countryOrigin: ALL
                ) {
                    edges {
                        _id
                        name
                        englishName
                    }
                }
            }
        `, { page: page });
        return data?.mangas?.edges ? data.mangas.edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name)) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        function buildChapters(info: APIChapters['episodeInfos'], chapters: string[], type: 'sub' | 'raw'): Chapter[] {
            return chapters.map(chapter => {
                const num = parseFloat(chapter);
                const infos = info.find(({ episodeIdNum }) => episodeIdNum === num);
                const title = [
                    'Chapter',
                    infos.episodeIdNum,
                    infos.notes && `- ${infos.notes}`,
                    type === 'raw' ? '[raw]' : '',
                ].joinTitleSegments();

                return new Chapter(this, manga, JSON.stringify({ id: `${num}`, translationType: type }), title);
            });
        }

        const { episodeInfos, manga: { availableChaptersDetail: { raw, sub } } } = await this.FetchAPI<APIChapters>(`
            query ($id: String!, $showId: String!) {
                manga(_id: $id) {
                    _id
                    name
                    availableChaptersDetail
                }
                episodeInfos(
                    showId: $showId
                    episodeNumStart: 0
                    episodeNumEnd: 9999
                ) {
                    episodeIdNum
                    notes
                    uploadDates
                }
            }
        `, { id: manga.Identifier, showId: `manga@${manga.Identifier}` });

        const allChapters = [
            ...buildChapters(episodeInfos, sub, 'sub'),
            ...buildChapters(episodeInfos, raw, 'raw'),
        ];

        return allChapters.toSorted(
            (self, other) => parseFloat((JSON.parse(other.Identifier) as ChapterID).id) - parseFloat((JSON.parse(self.Identifier) as ChapterID).id)
        );
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id: chapterString, translationType }: ChapterID = JSON.parse(chapter.Identifier);
        const { chapterPages: { edges } } = await this.FetchAPI<APIPages>(undefined, {
            mangaId: chapter.Parent.Identifier,
            chapterString,
            limit: 999,
            offset: 0,
            translationType
        }, '466783e19a7540387e34265be906bebbe853857088d45d28af922ab8668ebb31');

        let { pictureUrlHead, pictureUrls } = edges.at(0);
        pictureUrlHead = pictureUrlHead ?? this.URI.origin;
        const domain = (/^https?:\/\//).test(pictureUrlHead) ? pictureUrlHead : 'https://' + pictureUrlHead;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, domain), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject, queryHash?: string): Promise<T> {
        const result: APIEncryptedResult | APIResult<T> = queryHash
            ? await (async () => {
                const url = new URL(this.apiURL);
                url.searchParams.set('variables', JSON.stringify(variables));
                url.searchParams.set('extensions', JSON.stringify({ persistedQuery: { version: 1, sha256Hash: queryHash } }));
                return (await FetchJSON<APIResult<T>>(new Request(url, { headers: { Referer: this.URI.href, Origin: this.URI.origin } }))).data;
            })()
            : await FetchGraphQL<APIEncryptedResult & T>(new Request(this.apiURL), '', query, variables);
        return result.tobeparsed ? await this.Decrypt<T>(result.tobeparsed) : (result as T);
    }

    private async Decrypt<T>(data: string): Promise<T> {
        const message = GetBytesFromBase64(data);
        const ciphertext = message.slice(13, message.length - 16);
        const tag = message.slice(message.length - 16);
        const algorithm = { name: 'AES-GCM', iv: message.slice(1, 13) };
        const key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', GetBytesFromUTF8('Xot36i3lK3:v1')), algorithm, false, ['decrypt']);
        const result = await crypto.subtle.decrypt(algorithm, key, new Uint8Array([...ciphertext, ...tag]));
        return JSON.parse(GetUTF8FromBytes(result)) as T;
    }
}