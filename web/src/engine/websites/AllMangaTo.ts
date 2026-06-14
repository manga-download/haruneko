import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import { Delay } from '../BackgroundTimers';
import { FetchGraphQL, FetchWindowScript } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetBytesFromUTF8, GetUTF8FromBytes } from '../BufferEncoder';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    mangas: {
        edges: {
            _id: string;
            name: string;
            englishName: string | null;
        }[];
    };
};

type ChapterID = {
    chapterString: string;
    translationType: 'raw' | 'sub';
};

type APIChapters = {
    episodeInfos: {
        episodeIdNum: number;
        uploadDates: Record<ChapterID['translationType'], string>;
        notes?: string;
    }[];
};

type APIPages = {
    chapterPages: {
        edges: [{
            pictureUrlHead: string;
            pictureUrls: {
                url: string;
            }[];
        }];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.manga-page nav ol li:last-of-type', (li, uri) => ({ id: uri.href.split('/').at(-1), title: li.innerText.trim() }))
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
            await Delay(250);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { mangas: { edges } } = await FetchGraphQL<APIMangas>(new Request(this.apiURL), '', `
            query ($page: Int) {
                mangas(page: $page, format: ALL, countryOrigin: ALL, search: { allowAdult: true }) {
                    edges { _id, name, englishName }
                }
            }
        `, { page: page });
        return edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodeInfos } = await FetchGraphQL<APIChapters>(new Request(this.apiURL), '', `
            query ($showId: String!) {
                episodeInfos(showId: $showId, episodeNumStart: 0, episodeNumEnd: 9999) {
                    episodeIdNum, uploadDates, notes
                }
            }
        `, { showId: `manga@${manga.Identifier}` });

        return episodeInfos
            .toSorted((self, other) => other.episodeIdNum - self.episodeIdNum)
            .reduce((aggregator: Chapter[], { episodeIdNum, notes, uploadDates }) => {
                const chapters = Object.keys(uploadDates).map(translationType => {
                    const chapterString = `${episodeIdNum}`;
                    const title = [
                        'Chapter',
                        episodeIdNum,
                        notes && `- ${notes}`,
                        translationType === 'raw' ? '[raw]' : null,
                    ].joinTitleSegments();
                    return new Chapter(this, manga, JSON.stringify(<ChapterID>{ chapterString, translationType }), title);
                });
                return [...aggregator, ...chapters];
            }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { tobeparsed: encrypted } = await FetchGraphQL<{ tobeparsed: string; }>(new Request(this.apiURL), '', undefined, {
            ...<ChapterID>JSON.parse(chapter.Identifier),
            mangaId: chapter.Parent.Identifier,
            limit: 999,
            offset: 0,
        }, { persistedQuery: { version: 1, sha256Hash: '466783e19a7540387e34265be906bebbe853857088d45d28af922ab8668ebb31' } });
        const { chapterPages: { edges: [{ pictureUrlHead, pictureUrls }] } } = await this.Decrypt<APIPages>(encrypted);
        let origin = pictureUrlHead ?? this.URI.origin;
        origin = origin.startsWith('https://') ? origin : 'https://' + origin;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, origin), { Referer: this.URI.href }));
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