import { Tags } from '../Tags';
import icon from './MangaTown.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import { FetchCSS } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\//, 'div.article_content h1.title-top')
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
        const data = await FetchCSS<HTMLOptionElement>(new Request(new URL(chapter.Identifier, this.URI)), 'div.manga_read_footer div.page_select select option');
        return data.filter(option => !/featured\.html$/.test(option.value)).map(option => new Page(this, chapter, new URL(option.value, this.URI), { Referer: 'mangahere.com' }));
    }
}