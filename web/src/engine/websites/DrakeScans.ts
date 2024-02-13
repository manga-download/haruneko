import { Tags } from '../Tags';
import icon from './DrakeScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Drake Scans"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS("div.page-break > img.wp-manga-chapter-img")
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drakescans', 'DrakeScans', 'https://drakescans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}