import { Tags } from '../Tags';
import icon from './DiamondFansub.webp';
import { DecoratableMangaScraper, type Chapter, type Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/diamondfansub\.com\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="diamondfansub"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('diamondfansub', 'DiamondFansub', 'https://diamondfansub.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Madara.FetchPagesSinglePageCSS.call(this, chapter);
        pages.forEach(page => page.Link.protocol = this.URI.protocol);
        return pages;
    }
}