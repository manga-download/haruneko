import { Tags } from '../Tags';
import icon from './Inkapk.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/obras\/[^/]+\/$/)
@Madara.MangasMultiPageCSS()
@Madara.ChaptersMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('inkapk', 'Inkapk', 'https://inkapk.net', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}
