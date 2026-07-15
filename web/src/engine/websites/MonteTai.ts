import { Tags } from '../Tags';
import icon from './MonteTai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h2.mtx-hero-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('montetai', 'MonteTai', 'https://montetaiscanlator.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Scanlator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}