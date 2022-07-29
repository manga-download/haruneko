import { Tags } from '../Tags';
import icon from './IchirinNoHanaYuri.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/ichirinnohanayuriscan\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ichirinnohanayuri', 'Ichirin No Hana Yuri', 'https://ichirinnohanayuriscan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Rating.Suggestive);
    }

    public override get Icon() {
        return icon;
    }
}