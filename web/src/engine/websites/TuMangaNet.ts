import { Tags } from '../Tags';
import icon from './TuMangaNet.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article h1.title')
@Common.MangasMultiPageCSS('article.anime a', Common.PatternLinkGenerator('/biblioteca-manga?page={page}'))
@Common.ChaptersSinglePageCSS('ul.episodes-list li a')
@Common.PagesSinglePageJS(`[...new DOMParser().parseFromString(servers.Demo, 'text/html').querySelectorAll('img')].map(element => element.getAttribute('src'))`, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumanganet', 'TuMangaNet', 'https://tumangas.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}