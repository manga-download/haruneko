import { Tags } from '../Tags';
import icon from './Dilar.webp';
import { Chapter, DecoratableMangaScraper, Page, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import * as Common from './decorators/Common';
import { GetBytesFromBase64, GetBytesFromUTF8 } from '../BufferEncoder';
import { Delay } from '../BackgroundTimers';

type APIResult = {
    iv: boolean,
    data: string;
}

type APISingleManga = {
    mangaDataAction: {
        mangaData: {
            id: number;
            title: string;
        }
    }
};

type APIMangas = {
    mangas: {
        id: number;
        title: string;
    }[]
}

type APIChapters = {
    releases: {
        chapter: number;
        title: string;
    }[]
};

type APIPages = {
    globals: {
        pageUrl: string;
        wla: {
            configs: {
                http_media_server: string;
                media_server: string;
            }
        }
    },
    readerDataAction: {
        readerData: {
            release: {
                pages: string[];
                storage_key: string;
            }
        }
    }
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://dilar.tube/api/mangas/';

    public constructor() {
        super('dilar', `Dilar`, 'https://dilar.tube', Tags.Language.Arabic, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/mangas/\\d+/[^/]+$`).test(url);
    }

    private Slugify(name: string): string {
        return name.toString().toLowerCase().replace(/\s+/g, '-').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '').replace('/', '-');
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [response] = await FetchCSS(new Request(url), 'script[data-component-name="HomeApp"]');
        const { mangaDataAction: { mangaData: { id, title } } }: APISingleManga = JSON.parse(response.textContent);
        return new Manga(this, provider, `${id}`, title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 0, run = true; run; page++) {
                await Delay(500);
                const body = {
                    categories: { include: [], exclude: [] },
                    chapters: { min: '', max: '' },
                    dates: { start: null, end: null },
                    manga_types: {
                        include: ['1', '2', '3', '4', '5', '6', '7', '8'],
                        exclude: []
                    },
                    novel: false,
                    oneshot: false,
                    story_status: { include: [], exclude: [] },
                    title: '',
                    translation_status: { include: [], exclude: ['3'] },
                    page
                };

                const response = await FetchJSON<APIResult>(new Request(new URL('./search', this.apiUrl), {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: JSON.stringify(body)
                }));
                const data = response.iv ? await this.Decrypt(response.data) : response.data;
                const { mangas }: APIMangas = JSON.parse(data);
                const newMangas = !mangas ? [] : mangas.map(manga => new Manga(this, provider, manga.id.toString(), manga.title.trim()));
                newMangas.length > 0 ? yield* newMangas : run = false;
            }

        }.call(this));

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { releases } = await FetchJSON<APIChapters>(new Request(new URL(`./${manga.Identifier}/releases`, this.apiUrl)));
        return releases.map(({ chapter, title }) => new Chapter(this, manga, `${chapter}`, [chapter, title].join(' - ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterUrl = new URL(`/mangas/${chapter.Parent.Identifier}/${this.Slugify(chapter.Parent.Title)}/${chapter.Identifier}`, this.URI);
        const [response] = await FetchCSS(new Request(chapterUrl), 'script[data-component-name="HomeApp"]');
        const { readerDataAction: { readerData: { release: { pages, storage_key } } }, globals: { wla: { configs: { http_media_server, media_server } } } }: APIPages = JSON.parse(response.textContent);
        const baseUrl = (http_media_server || media_server) + '/uploads/releases';
        return pages.map(page => new Page(this, chapter, new URL([baseUrl, storage_key, 'hq', page].join('/'))));
    }

    private async Decrypt(message: string): Promise<string> {
        const [b64plaintext, , b64Iv, keyData] = message.split('|'); //0 : plaintext in b64, 2 : iv in b64, 3: key in b64
        const plaintextBuffer = GetBytesFromBase64(b64plaintext);
        const iv = GetBytesFromBase64(b64Iv);
        const key = new Uint8Array(await crypto.subtle.digest('SHA-256', GetBytesFromUTF8(keyData)));
        const secretKey = await crypto.subtle.importKey(
            'raw',
            key,
            {
                name: 'AES-CBC',
                length: 128
            }, true, ['decrypt']);

        const decrypted = await crypto.subtle.decrypt({
            name: 'AES-CBC',
            iv: iv
        }, secretKey, plaintextBuffer);
        return new TextDecoder('utf-8').decode(decrypted);
    }
}