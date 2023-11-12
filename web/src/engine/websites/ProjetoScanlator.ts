import { Tags } from '../Tags';
import icon from './ProjetoScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('projetoscanlator', 'Projeto Scanlator', 'https://projetoscanlator.com', Tags.Media.Manga, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}