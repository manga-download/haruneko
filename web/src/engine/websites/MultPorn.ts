import { Tags } from '../Tags';
import icon from './AdonisFansub.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

const pageScript = `
    new Promise( resolve => {
        const pages = [];
        for (i = 1; i <= jcgal.getImageCount(); i++) {
            pages.push(jcgal.getImageInfo(i).largeImageURL);
        }
        resolve(pages);
    });
`;

@Common.MangaCSS(/^{origin}\/(comics|pictures|hentai_manga|rule_63|humor|gay_porn_comics)\/[^/]+/, 'div.breadcrumb span.last')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('multporn', 'MultPorn', 'https://multporn.net', Tags.Media.Comic, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        const categories = ['comics', 'pictures', 'hentai_manga', 'rule_63', 'humor', 'gay_porn_comics'];

        for (let category of categories) {
            category += '?page={page}';
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, category, 'div.view-content table tr td strong a', 0);
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 0, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(`${manga.Identifier}?page=0,${page}`, this.URI);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div.view-content table tr td strong.field-content a');
        return data?.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim())) ?? [];
    }

}