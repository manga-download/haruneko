import { Tags } from '../Tags';
import icon from './HentaiTokyo.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.post-titulo')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('ul.post-fotos li img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaitokyo', 'Hentai Tokyo', 'https://hentaitokyo.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const response = await Fetch(new Request(new URL(`./page/${page}/`, this.URI)));
        if (response.status === 404) return [];
        const mangas = [...new DOMParser().parseFromString(await response.text(), 'text/html').querySelectorAll<HTMLAnchorElement>('div.lista ul li a[href^="https://hentaitokyo.net"]')];
        return mangas.map(manga => new Manga(this, provider, manga.pathname, manga.text.trim()));
    }
}