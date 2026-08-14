import { Tags } from '../Tags';
import icon from './MerlinScans.webp';
import { Fetch, FetchJSON, FetchNextJS } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';

type APIMangas = {
    data: {
        slug: string;
        title: string;
    }[];
};

type HydratedChapters = {
    episodes: {
        id: string;
        number: number;
    }[];
};

type APIToken = {
    token: string;
};

type PageData = {
    episodeId: string;
    pageIndex: number;
    token: string;
};

@Common.MangaCSS(/^{origin}\/seri\/[^/]+$/, 'meta[property="og:title"]')
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('merlinscans', 'MerlinToon', 'https://merlintoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMangas>(new Request(new URL('./series', this.apiURL)));
        return data.map(({ slug, title }) => new Manga(this, provider, `/seri/${slug}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { episodes } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'episodes' in data);
        return episodes.map(({ id, number }) => new Chapter(this, manga, `${id}/${number}`, `Bölüm ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageData>[]> {
        const [episodeId, chapterNumber] = chapter.Identifier.split('/');
        const { token } = await FetchJSON<APIToken>(new Request(new URL('./reader/page-token', this.apiURL), {
            method: 'POST',
            body: JSON.stringify({
                episodeId
            })
        }));

        const { readerPageCount } = await FetchNextJS<{ readerPageCount: number; }>(new Request(new URL(`${chapter.Parent.Identifier}/${chapterNumber}`, this.apiURL)), data => 'readerPageCount' in data);
        return new Array(readerPageCount).fill(0).map((_, index) => index).map(pageIndex => new Page<PageData>(this, chapter, new URL('./reader/pages', this.apiURL), {
            episodeId, pageIndex, token
        }));
    }

    public override async FetchImage(page: Page<PageData>, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const { episodeId, pageIndex, token } = page.Parameters;
        return this.imageTaskPool.Add(async () => {
            return (await Fetch(new Request(page.Link, {
                method: 'POST',
                body: JSON.stringify({
                    episodeId,
                    pageIndex,
                    token
                })
            }))).blob();
        }, priority, signal);
    }
}