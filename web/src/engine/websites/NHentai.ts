import { Tags } from '../Tags';
import icon from './NHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ExtractImageLink(element: HTMLImageElement) {
    return element.dataset.src.replace(/\/t(\d+)\./, '/i$1.').replace(/\/(\d+)t\./, '/$1.');
}

@Common.MangaCSS(/^{origin}\/g\/\d+\/$/, 'div#info h1.title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.thumbs img.lazyload', ExtractImageLink)
@Common.ImageElement()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhentai', `NHentai`, 'https://nhentai.net', Tags.Media.Manga, Tags.Media.Cartoon, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}