import { Tags } from '../Tags';
import icon from './ZinMangaNet.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS()
@Madara.ChaptersSinglePageCSS()
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zinmanganet', 'ZinManga(.net)', 'https://www.zinmanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Madara.FetchPagesSinglePageCSS.call(this, chapter, 'div.page-break img.wp-manga-chapter-img');
        return pages.map(page => new Page(this, chapter, page.Link, { Referer: this.URI.href }));
    }

}