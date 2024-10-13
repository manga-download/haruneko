import { Tags } from '../Tags';
import icon from './MyHentaiGallery.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function PageLinkExtractor(image: HTMLImageElement): string {
    return image.src.replace(/\/thumbnail\//, '/original/');
}

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.comic-name').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/g\/\d+$/, 'div.comic-description h1')
@Common.MangasMultiPageCSS('/gpage/{page}', 'ul.comics-grid li.item div.comic-inner a', 1, 1, 0, MangaInfoExtractor)
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('ul.comics-grid li.item div.comic-inner div.comic-thumb img', PageLinkExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('myhentaigallery', 'MyHentaiGallery', 'https://myhentaigallery.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}