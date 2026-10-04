import { Tags } from '../Tags';
import icon from './VerMangasPorno.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/doujins\/[^/]+\/$/, 'h1.pp-single-title')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.pp-card-link', Common.PatternLinkGenerator('/manga-hentai-xxx/page/{page}/'), 0, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('.pp-card-title').textContent.trim()
}))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.pp-comic-content img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('vermangasporno', `VerMangasPorno`, 'https://vermangasporno.com', Tags.Media.Manga, Tags.Language.Spanish, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}