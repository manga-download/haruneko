import { Tags } from '../Tags';
import icon from './ComicDom.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/comicdom\.org\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="comicdom"])')
@Madara.MangasMultiPageAJAX('div.post-title h3 a:last-of-type')
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicdom', 'ComicDom', 'https://comicdom.org', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}