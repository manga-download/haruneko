import { Tags } from '../Tags';
import icon from './Anchira.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';
import { Priority, TaskPool } from '../taskpool/TaskPool';
import { RateLimit } from '../taskpool/RateLimit';

type APIMangas = {
    entries: APIManga[]
}

type APIManga = {
    id: number,
    key: string,
    title: string
    hash?: string,
    names?: string[]
}

@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly mangasTaskPool = new TaskPool(4, new RateLimit(8, 1));
    private readonly apiUrl = new URL('/api/v1/', this.URI).href;
    private readonly imageCDN = 'https://kisakisexo.xyz';
    private readonly mangaRegexp = new RegExp(`^${this.URI.origin}/g/([\\d]+/[^/]+)$`);

    public constructor() {
        super('anchira', `Anchira`, 'https://anchira.to', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return this.mangaRegexp.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = url.match(this.mangaRegexp);
        const item = await FetchJSON<APIManga>(new Request(new URL(`${this.apiUrl}library/${matches[1]}`), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': `${this.URI}?`
            }
        }));
        return new Manga(this, provider, `${item.id}/${item.key}`, item.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const cancellator = new AbortController();
        try {
            const mangaList = [];
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromPage(page, provider, cancellator.signal);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
            return mangaList.distinct();
        } catch (error) {
            cancellator.abort();
            throw error;
        }
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin, signal: AbortSignal) {
        return this.mangasTaskPool.Add(async () => {
            const uri = new URL(`${this.apiUrl}library?page=${page}`);
            if (page == 1) uri.searchParams.delete('page');
            const { entries } = await FetchJSON<APIMangas>(new Request(uri, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `${this.URI}?`
                }
            }));
            return entries ? entries.map(item => new Manga(this, provider, `${item.id}/${item.key}`, item.title.trim())) : [];
        }, Priority.Normal, signal);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const data = await FetchJSON<APIManga>(new Request(`${this.apiUrl}library/${chapter.Identifier}/data`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': `${this.URI}/g/${chapter.Identifier}`
            }
        }));
        return data.names.map(image => {
            const pageUrl = new URL(`/${data.id}/${data.key}/${data.hash}/a/${image}`, this.imageCDN);
            return new Page(this, chapter, pageUrl);
        });

    }
}