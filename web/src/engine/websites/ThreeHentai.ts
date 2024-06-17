import { Tags } from '../Tags';
import icon from './ThreeHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ExtractImageLink(element: HTMLImageElement) {
    return element.dataset.src.replace(/\/(\d+)t\./, '/$1.');
}

@Common.MangaCSS(/^https:\/\/([a-z]{2,3}\.)?3hentai\.net\/d\/\d+/, 'div#main-info span.middle-title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.single-thumb img.lazy', ExtractImageLink)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('3hentai', `3Hentai`, 'https://3hentai.net', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}