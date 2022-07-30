import { Tags } from '../Tags';
import icon from './HManhwa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hmanhwa\.com\/manhwa\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hmanhwa', 'HManhwa', 'https://hmanhwa.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Language.Korean, Tags.Language.Thai, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}