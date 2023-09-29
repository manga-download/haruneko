import { Tags } from '../Tags';
import icon from './MoonWitchInLove.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/moonwitchinlovescan\.com\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Moon Witch in Love"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('moonwitchinlove', 'Moon Witch In Love', 'https://moonwitchinlovescan.com/', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}