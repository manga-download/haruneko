import { Tags } from '../Tags';
import icon from './MangaOrigin.webp';
import { PageLinkExtractor, ZeistManga } from './templates/ZeistManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/search\/label\/[^/]+$/, 'span.search-label')
@Common.MangasSinglePageCSS('/', 'div#Label1 li a.label-name', Common.AnchorInfoExtractor(false, 'span'))
@Common.PagesSinglePageCSS('div.separator a img[alt]', PageLinkExtractor)
export default class extends ZeistManga {
    public constructor() {
        super('mangaorigin', 'Manga Origin', 'https://mangaoriginread.blogspot.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.Arabic, Tags.Source.Scanlator);
        this.WithMangaSlugScript(`new URL(document.querySelector('div#blog-pager a')).pathname.split('/').at(-1);`);
    }

    public override get Icon() {
        return icon;
    }
}