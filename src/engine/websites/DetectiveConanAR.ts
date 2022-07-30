import { Tags } from '../Tags';
import icon from './DetectiveConanAR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manga\.detectiveconanar\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('detectiveconanar', 'العربية  كونان (Conan Arabic)', 'https://manga.detectiveconanar.com', Tags.Media.Manga, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}