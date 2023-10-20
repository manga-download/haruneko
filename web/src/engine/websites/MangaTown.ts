import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function PageLinkExtractor(element: HTMLOptionElement) {
    return element.value;
}

@Common.MangaCSS(/^https?:\/\/www\.mangatown\.com\/manga\//, 'div.article_content h1.title-top')
@Common.MangasMultiPageCSS('/directory/0-0-0-0-0-0/{page}.htm', 'ul.manga_pic_list li p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter_list li a')
@Common.ImageAjaxFromHTML('img#image')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatown', `MangaTown`, 'https://www.mangatown.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div.manga_read_footer div.page_select select option', PageLinkExtractor);
        return pages.map(page => new Page(this, chapter, new URL(page.Link.pathname, this.URI), { Referer: 'mangahere.com' }));
    }
}