import { Tags } from '../Tags';
import icon from './MangaWorldAdult.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/\d+\/[^/]+$/, 'nav.breadcrumb li:last-of-type a')
@Common.MangasMultiPageCSS('article.card h3.card-title a', Common.PatternLinkGenerator('/archive?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul.ch-list li.ch-row a.ch', undefined, anchor => ({
    id: anchor.pathname + anchor.search,
    title: anchor.querySelector('span.ch-name').textContent.trim()
}))
@Common.PagesSinglePageCSS('div.reader-stage img.reader-page')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangaworldadult', `Manga World Adult`, 'https://www.mangaworldadult.org', Tags.Language.Italian, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}