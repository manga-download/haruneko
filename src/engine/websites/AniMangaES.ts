import { Tags } from '../Tags';
import icon from './AniMangaES.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/animangaes\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS('div.reading-content p img')
@Common.ImageDirect()
// TODO: Website no longer exist?
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('animangaes', 'ANIMANGAES', 'https://animangaes.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}