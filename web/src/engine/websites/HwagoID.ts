import { Tags } from '../Tags';
import icon from './HwagoID.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/komik\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Hwago"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2('div.chapter-link > a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hwagoid', 'HwagoID', 'https://hwago01.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}