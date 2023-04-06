import { Tags } from '../Tags';
import icon from './AkuzenaiArts.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/akuzenaiarts\.org\/comic\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Akuzenai Arts"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anitationarts', 'Akuzenai Arts', 'https://akuzenaiarts.org', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}