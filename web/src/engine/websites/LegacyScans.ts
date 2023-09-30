import { Tags } from '../Tags';
import icon from './LegacyScans.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest } from '../FetchProvider';

type APIMangas = {
    comics: {
        title: string,
        slug : string
    }[]
}
function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('span').textContent.trim()
    };
}

@Common.MangaCSS(/^https?:\/\/legacy-scans\.com\/comics\/[^/]+$/, 'div.serieTitle h1')
@Common.ChaptersSinglePageCSS('div.chapterList a', ChapterExtractor)
@Common.PagesSinglePageCSS('div.readerMainContainer img[data-nuxt-img]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.legacy-scans.com';
    private readonly mangasPerPages = 100;

    public constructor() {
        super('legacyscans', 'Legacy-Scans', 'https://legacy-scans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        let run = true;
        let start = 1;
        let end = start + this.mangasPerPages;
        while (run) {
            const mangas = await this.getMangasFromRange(provider, start, end);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            start = end + 1;
            end = start + this.mangasPerPages;
        }
        return mangaList;
    }
    async getMangasFromRange(provider: MangaPlugin, start: number, end : number): Promise<Manga[]>{
        const url = new URL(`/misc/comic/search/query?status=&order=&genreNames=&type=&start=${start}&end=${end}`, this.apiUrl);
        const request = new FetchRequest(url.href);
        const mangas = await FetchJSON<APIMangas>(request);
        return mangas.comics.map(manga => new Manga(this, provider, `/comics/${manga.slug}`, manga.title.trim()));
    }

}