import { Tags } from '../Tags';
import icon from './AsuraScansTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('asurascans-tr', `Asura Scans (TR)`, 'https://asurascans.com.tr', Tags.Language.Turkish, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }
}
