import { Tags } from '../Tags';
import icon from './TiaManhwa.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { Fetch } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'h1.post-titulo')
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('ul.post-fotos li a img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaidatia', 'Hentai da Tia', 'https://hentaidatia.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        // There are always mangas even on 404 page, resulting in endless loop.
        for (const category of ['manga-hentai', 'doujinshi']) {
            for (let page = 1, run = true; run; page++) {
                const response = await Fetch(new Request(new URL(`/${category}/page/${page}/`, this.URI)));
                const mangas = [...new DOMParser().parseFromString(await response.text(), 'text/html')
                    .querySelectorAll<HTMLAnchorElement>('div.lista ul li a:not([target])')]
                    .map(({ pathname, title }) => new Manga(this, provider, pathname, title.trim()));
                mangaList.push(...mangas);
                run = response.ok;
            }
        }
        return mangaList.distinct();
    }
}