import { Tags } from '../Tags';
import icon from './ShinobiScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

// TODO : Novel Support

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shinobiscans', 'ShinobiScans', 'https://shinobiscans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Novel, Tags.Language.Italian, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}