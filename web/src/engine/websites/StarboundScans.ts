import { Tags } from '../Tags';
import icon from './StarboundScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2(undefined, (a: HTMLAnchorElement) => ({ id: a.pathname + '?style=list', title: a.text.trim() }))
@Madara.PagesSinglePageCSS('div.page-container img.wp-manga-chapter-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('starboundscans', 'Starbound Scans', 'https://starboundscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}