import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';

@Common.MangaCSS(/^https?:\/\/www\.mangatown\.com\/manga\//, 'div.article_content h1.title-top')
@Common.MangasMultiPageCSS('/directory/0-0-0-0-0-0/{page}.htm', 'ul.manga_pic_list li p.title a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('ul.chapter_list li a')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangatown', `MangaTown`, 'https://www.mangatown.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageList = [];
        const url = new URL(chapter.Identifier, this.URI);
        let request = new FetchRequest(url.href);
        const data = await FetchCSS<HTMLOptionElement>(request, 'div.manga_read_footer div.page_select select option');

        for (const page of data) {
            request = new FetchRequest(new URL(page.value, this.URI).href);
            const pages = await FetchCSS<HTMLImageElement>(request, 'img#image');
            pages.forEach(element => pageList.push(new Page(this, chapter, new URL(element.src), { Referer : 'mangahere.com' })));
        }

        return pageList;
    }

}
