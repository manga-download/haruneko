import { Tags } from '../Tags';
import icon from './HentaiComics.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[^/]+\/[^/]+\/$/, 'div.posts h1.post-title')
@Common.MangasMultiPageCSS('div.post h2 a', Common.PatternLinkGenerator('/page/{page}/', 1))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.single-post p img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaicomics', 'HentaiComics', 'https://hentaicomics.biz', Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}