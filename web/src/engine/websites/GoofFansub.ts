import { Tags } from '../Tags';
import icon from './GoofFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gooffansub\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gooffansub', 'Goof Fansub', 'https://gooffansub.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}