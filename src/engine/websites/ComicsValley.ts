import { Tags } from '../Tags';
import icon from './ComicsValley.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/adult-comics\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicsvalley', 'Comics Valley', 'https://comicsvalley.com', Tags.Media.Comic, Tags.Language.English, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}