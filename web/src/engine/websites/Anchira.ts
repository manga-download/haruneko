import { Tags } from '../Tags';
import icon from './Anchira.webp';
import { type Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

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

    private readonly apiUrl = `${this.URI}api/v1/`;
    private readonly imageCDN = 'https://kisakisexo.xyz';

    public constructor() {
        super('anchira', `Anchira`, 'https://anchira.to', Tags.Language.English, Tags.Media.Manga, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/g/[\\d]+/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const matches = url.match(/\/g\/(\d+)\/([^/]+)/);
        const id = matches[1];
        const key = matches[2];
        const item = await FetchJSON<APIManga>(new Request(new URL(`${this.apiUrl}library/${id}/${key}`), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': `${this.URI}?`
            }
        }));
        return new Manga(this, provider, JSON.stringify({
            id: item.id.toString(),
            key: item.key
        }), item.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        const throttle = 500;
        let reducer = Promise.resolve();
        for (let page = 1, run = true; run; page++) {
            await reducer;
            reducer = new Promise(resolve => setTimeout(resolve, throttle));
            const mangas = await this.getMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async getMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        try {
            const uri = new URL(`${this.apiUrl}library?page=${page}`);
            if (page == 1) uri.searchParams.delete('page');
            const { entries } = await FetchJSON<APIMangas>(new Request(uri, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Referer': `${this.URI}?`
                }
            }));
            return entries.map(item => new Manga(this, provider, JSON.stringify({
                id: item.id.toString(),
                key: item.key
            }), item.title.trim()));
        }
        catch (error) {
            return [];
        }

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaid: APIManga = JSON.parse(chapter.Identifier);
        const data = await FetchJSON<APIManga>(new Request(new URL(`${this.apiUrl}library/${mangaid.id}/${mangaid.key}/data`), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': `${this.URI}/g/${mangaid.id}/${mangaid.key}`
            }
        }));
        return data.names.map(image => {
            const pageUrl = new URL(`/${data.id}/${data.key}/${data.hash}/a/${image}`, this.imageCDN);// /a/ ensure best quality. /b/ is lower
            return new Page(this, chapter, pageUrl);
        });

    }
}