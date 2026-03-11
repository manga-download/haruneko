import { Tags } from '../Tags';
import icon from './PornComix.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/gallery/, 'h1.post-title')
@Common.MangasMultiPageCSS('h2.post-title a', Common.PatternLinkGenerator('/multporn-net/page/{page}/'))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS<HTMLAnchorElement>('figure a', anchor => anchor.href)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('porncomix', 'PornComix', 'https://bestporncomix.com', Tags.Language.English, Tags.Media.Manga, Tags.Media.Comic, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}