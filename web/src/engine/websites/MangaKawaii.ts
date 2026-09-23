import { Tags } from '../Tags';
import icon from './MangaKawaii.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.mk-display')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div#mk-results div.grid a.mk-card', Common.PatternLinkGenerator('/mangas?page={page}'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('img').alt.trim()
}))
@Common.ChaptersMultiPageCSS('div[data-ch-list] a.ch-num', Common.PatternLinkGenerator('{id}/chapitres?page={page}'))
@Common.PagesSinglePageJS(`[...Alpine.$data(document.querySelector('div[x-data*="JSON.parse"]')).imgs]`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakawaii', `MangaKawaii`, 'https://www.mangakawaii.fr', Tags.Language.French, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}