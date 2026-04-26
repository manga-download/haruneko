import { Delay } from '../BackgroundTimers';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';
import { FetchGraphQL } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './AllMangaTo.webp';
import * as Common from './decorators/Common';

type APIEncryptedResult = {
    tobeparsed?: string;
};

type APIMangas = {
    mangas: {
        edges: APIManga[];
    };
};

type APIManga = {
    _id: string;
    name: string;
    englishName: string | null;
    availableChaptersDetail: {
        raw: string[];
        sub: string[];
    }
};

type APIChapters = {
    episodeInfos: APIChapter[];
    manga: APIManga;
};

type APIChapter = {
    episodeIdNum: number;
    notes?: string;
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

@Common.MangaCSS<HTMLUListElement>(/{origin}\/manga\/[^/]+$/, 'ol.breadcrumb li:last-of-type', (li, uri) => ({ id: uri.href.split('/').at(-1), title: li.innerText.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://api.allanime.day/api';

    public constructor() {
        super('allmanga', 'AllManga.to', 'https://allmanga.to', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(200);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangaList.isMissingLastItemFrom(mangas) ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const query = `
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
        `;

        const data = await this.FetchAPI<APIMangas>(query, { page: page });
        return data?.mangas?.edges ? data.mangas.edges.map(manga => new Manga(this, provider, manga._id, manga.englishName ?? manga.name)) : [];
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        function buildChapters(chapters: string[], type: 'sub' | 'raw'): Chapter[] {
            return chapters.map(chapter => {
                const num = parseFloat(chapter);
                const infos = episodeInfos.find(({ episodeIdNum }) => episodeIdNum === num);
                const title = [
                    'Chapter',
                    infos.episodeIdNum,
                    infos.notes ? '-' : '',
                    infos.notes ?? '',
                    type === 'raw' ? '[raw]' : '',
                ].filter(Boolean).join(' ').trim();

                return new Chapter(this, manga, JSON.stringify({ id: `${num}`, translationType: type }), title);
            });
        }

        const query = `
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
        `;

        const { episodeInfos, manga: { availableChaptersDetail: { raw, sub } } } =
            await this.FetchAPI<APIChapters>(query, { id: manga.Identifier, showId: `manga@${manga.Identifier}` });

        const allChapters = [
            ...buildChapters.call(this, sub, 'sub'),
            ...buildChapters.call(this, raw, 'raw')
        ];

        return allChapters.sort(
            (a, b) => parseFloat((JSON.parse(b.Identifier) as ChapterID).id) - parseFloat((JSON.parse(a.Identifier) as ChapterID).id)
        );
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id: chapterId, translationType }: ChapterID = JSON.parse(chapter.Identifier);
        const query = `
            query (
                $id: String!
                $translationType: VaildTranslationTypeMangaEnumType!
                $chapterNum: String!
            ) {
                chapterPages(
                    mangaId: $id
                    translationType: $translationType
                    chapterString: $chapterNum
                ) {
                    edges {
                        pictureUrls
                        pictureUrlHead
                    }
                }
            }
        `;

        const { chapterPages: { edges } } = await this.FetchAPI<APIPages>(query, {
            id: chapter.Parent.Identifier,
            chapterNum: chapterId,
            translationType
        });
        let { pictureUrlHead, pictureUrls } = edges.at(0);
        pictureUrlHead = pictureUrlHead ?? this.URI.origin;
        const domain = (/^https?:\/\//).test(pictureUrlHead) ? pictureUrlHead : 'https://' + pictureUrlHead;
        return pictureUrls.map(({ url }) => new Page(this, chapter, new URL(url, domain), { Referer: this.URI.href }));
    }

    private async FetchAPI<T extends JSONElement>(query: string, variables: JSONObject): Promise<T> {
        const result = await FetchGraphQL<APIEncryptedResult & T>(new Request(new URL(this.apiUrl)), '', query, variables);
        return !result.tobeparsed ? result as T : await this.Decrypt<T>(result.tobeparsed);
    }

    private async Decrypt<T>(data: string): Promise<T> {
        const message = GetBytesFromBase64(data);
        const ciphertext = message.slice(13, message.length - 16);
        const tag = message.slice(message.length - 16);
        const algorithm = { name: 'AES-GCM', iv: message.slice(1, 13) };
        const key = await crypto.subtle.importKey('raw', await crypto.subtle.digest('SHA-256', GetBytesFromUTF8('Xot36i3lK3:v1')), algorithm, false, ['decrypt']);
        const result = await crypto.subtle.decrypt(algorithm, key, new Uint8Array([...ciphertext, ...tag]));
        return JSON.parse((new TextDecoder).decode(result)) as T;
    }
}