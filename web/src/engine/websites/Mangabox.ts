import { Tags } from '../Tags';
import icon from './Mangabox.webp';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import { GetTypedData } from './decorators/Common';

type APIMangas = {
    manga: {
        title: string;
        id: number;
    };
};
type APIResult<T> = {
    result: T;
};

type APIChapters = APIResult<{
    episodes: {
        episodeId: number;
        displayVolume: string;
        volume: number;
        mask: number;
    }[];
}>;

type JSONChapter = {
    episodeId: number;
    mask: number;
};

type PageParam = {
    mask: number;
};

@Common.MangaCSS<HTMLImageElement>(/{origin}\/reader\/\d+\/episodes\/$/, 'img[class^="_hero_"]', (element, uri) => ({ id: uri.pathname.match(/\/reader\/(\d+)/).at(1), title: element.alt.trim() }))
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://www.mangabox.me/api/honshi/';

    public constructor() {
        super('mangabox', 'Mangabox', 'https://www.mangabox.me', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run ; page++) {
                const data = await FetchJSON<APIMangas[]>(new Request(new URL(`./api/reader/episodes?page=${page}`, this.URI)));
                const mangas = data.map(({ manga: { id, title } }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { result: { episodes } } = await FetchJSON<APIChapters>(new Request(new URL('./jsonrpc', this.apiUrl), {
            method: 'POST',
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'get_all_episodes_by_manga_id',
                params: {
                    mangaId: parseInt(manga.Identifier)
                }
            }),
            headers: {
                'Content-type': 'application/json'
            }
        }));
        return episodes.map(({ episodeId, displayVolume, volume, mask }) => new Chapter(this, manga, JSON.stringify({ episodeId, mask }), displayVolume ?? `${volume}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParam>[]> {
        const { episodeId, mask } = JSON.parse(chapter.Identifier) as JSONChapter;
        const { imageUrls } = await FetchJSON<{ imageUrls: string[] }>(new Request(new URL(`./episode/${episodeId}/images`, this.apiUrl)));
        return imageUrls? imageUrls.map(url => new Page<PageParam>(this, chapter, new URL(url), { mask })): [];
    }

    public override async FetchImage(page: Page<PageParam>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal, true);
        return page.Parameters.mask ? GetTypedData(new Uint8Array(await blob.arrayBuffer()).map(byte => byte ^ page.Parameters.mask)) : blob;
    }
}