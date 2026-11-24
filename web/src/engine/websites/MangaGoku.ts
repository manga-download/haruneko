import { Tags } from '../Tags';
import { Page, type Chapter } from '../providers/MangaPlugin';
import icon from './MangaGoku.webp';
import * as Common from './decorators/Common';
import { MangaNel } from './templates/MangaNel';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:image:alt"]')
@Common.MangasMultiPageCSS('div.grid div.group h3 a', Common.PatternLinkGenerator('/manga-list/latest-manga?page={page}'), 250, Common.AnchorInfoExtractor(true))
@Common.ImageAjax()
export default class extends MangaNel {

    public constructor() {
        super('mangagoku', 'MangaGoku', 'https://www.mangagoku.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter) {
        const images = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div[data-page] img');
        return images.map(image => new Page(this, chapter, new URL(image.Link), { Referer: this.URI.href, Mirrors: [] }));
    }
}