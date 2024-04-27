import { Tags } from '../Tags';
import icon from './NiceOppai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').split(' - ')[0].trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div.wpm_pag h1.ttl')
@Common.MangasMultiPageCSS('/manga_list/all/any/name-az/{page}/', 'div.lst_ara div.cvr a', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('div#image-container img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('niceoppai', 'NiceOppai', 'https://www.niceoppai.net', Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList;
    }

    private async GetChaptersFromPage (manga: Manga, page: number): Promise<Chapter[]> {
        const elements = await FetchCSS(new Request(new URL(`${manga.Identifier}chapter-list/${page}/`, this.URI)), 'ul.lst li.lng_ a.lst');
        return elements.map(element => {
            const { id, title } = Common.AnchorInfoExtractor(true).call(this, element);
            return new Chapter(this, manga, id, title.replace(manga.Title, '').trim());
        });
    }
}