import { Tags } from '../Tags';
import icon from './ManyToonKR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manhwa-raw\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manytoonkr', 'ManyToonKR', 'https://manytoon.club', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}