import { Tags } from '../Tags';
import icon from './MangaKiss.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangakiss\.org\/manga\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakiss', 'Mangakiss', 'https://mangakiss.org', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}