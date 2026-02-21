import { Tags } from '../Tags';
import icon from './Reyume.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/\d+\/\d+\/[^/]+\.html$/, 'h1#post-title')
@Common.PagesSinglePageCSS('div#pages_panel div.separator a img', PageLinkExtractor)
export default class extends ZeistManga {

    public constructor() {
        super('reyume', 'Reyume', 'https://www.re-yume.my.id', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Scanlator);
        this.WithMangaSlugScript(`document.querySelector('[data-labelchapter]').dataset.labelchapter.trim();`);
    }

    public override get Icon() {
        return icon;
    }
}