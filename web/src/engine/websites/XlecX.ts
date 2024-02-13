import { Tags } from '../Tags';
import icon from './XlecX.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const titleElement = anchor.querySelector<HTMLHeadingElement>('h3.thumb__title ');
    return { id: anchor.pathname, title: titleElement.textContent.trim() };
}

@Common.MangaCSS(/^{origin}\/\d+-[\S]+\.html/, 'main div.sect__content div#dle-content article.page div.page__col-left h1')
@Common.MangasMultiPageCSS('/page/{page}/', 'main section.sect div#dle-content > a.thumb', 1, 1, 0, MangaExtractor)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('article.page a img, div.tabs ul.xfieldimagegallery.manyfotos li img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xlecx', `XlecX`, 'https://xlecx.one', Tags.Language.English, Tags.Source.Aggregator, Tags.Media.Comic, Tags.Media.Manga, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}