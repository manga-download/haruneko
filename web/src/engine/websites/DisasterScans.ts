import { Tags } from '../Tags';
import icon from './DisasterScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/disasterscans\.com\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Disaster Scans"])')
@Madara.MangasMultiPageAJAX('div.post-title h3 a:last-of-type, div.post-title h5 a:last-of-type')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('disasterscans', 'Disaster Scans', 'https://disasterscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}