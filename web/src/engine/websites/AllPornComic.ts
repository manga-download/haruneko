import { Tags } from '../Tags';
import icon from './AllPornComic.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/porncomic\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="AllPornComic"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageCSS()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('allporncomic', 'AllPornComic', 'https://allporncomic.com', Tags.Media.Comic, Tags.Source.Aggregator, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}