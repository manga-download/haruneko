import { Tags } from '../Tags';
import icon from './BrainRotComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('brainrotcomics', 'BrainRotComics', 'https://brainrotcomics.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Scanlator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}