import { Tags } from '../Tags';
import icon from './MyHentaiGallery.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/g\/\d+$/, 'div.comic-description h1')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('ul.comics-grid li.item div.comic-inner a', Common.PatternLinkGenerator('/gpage/{page}'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('.comic-name').textContent.trim() }))
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS<HTMLImageElement>('ul.comics-grid li.item div.comic-inner div.comic-thumb img', image => image.src.replace(/\/thumbnail\//, '/original/'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('myhentaigallery', 'MyHentaiGallery', 'https://myhentaigallery.com', Tags.Media.Manga, Tags.Media.Comic, Tags.Language.English, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}