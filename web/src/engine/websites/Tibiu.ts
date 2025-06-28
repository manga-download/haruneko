import { Tags } from '../Tags';
import icon from './Tibiu.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIMediaItems = {
    data: {
        id: string,
        name: string;
    }[];
};

function PageExtractor(element: HTMLImageElement) {
    return element.dataset.original || element.getAttribute('src');
}

@Common.MangaCSS(/^{origin}\/comic\/\d+$/, 'h2.comicInfo__title')
//@Common.PagesSinglePageCSS('div.rd-article__pic img[data-original]', PageExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://comic.tibiu.net/index.php/api/';

    public constructor () {
        super('tibiu', 'Tibiu', 'https://comic.tibiu.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Official, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (let page = 1, run = true; run; page++) {
            await Delay(150);
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { data } = await FetchJSON<APIMediaItems>(new Request(new URL(`./data/comic?page=${page}`, this.apiUrl)));
        return data.map(manga => new Manga(this, provider, `/comic/${manga.id}`, new DOMParser().parseFromString(manga.name, 'text/html').body.innerText.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const mangaId = manga.Identifier.match(/\d+$/).at(0);
        const { data } = await FetchJSON<APIMediaItems>(new Request(new URL(`./data/chapter?mid=${mangaId}`, this.apiUrl)));
        return data.map(chapter => new Chapter(this, manga, `/chapter/${mangaId}/${chapter.id}`, chapter.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.rd-article__pic img[data-original]', PageExtractor);
        return pages.filter(page => [ /boylove\.cc$/ ].none(pattern => pattern.test(page.Link.pathname)));
    }
}