import { Tags } from '../Tags';
import icon from './MilfToon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/comics\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('milftoon', 'Milftoon Comics', 'https://milftoon.xxx', Tags.Media.Comic, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}