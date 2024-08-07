import { Tags } from '../Tags';
import icon from './HentaiForce.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ExtractImageLink(element: HTMLImageElement) {
    return element.dataset.src.replace(/\/(\d+-\d+)t\./, '/$1.');
}

@Common.MangaCSS(/^{origin}\/view\/\d+$/, 'div#gallery-main-info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS('div.single-thumb img.lazy', ExtractImageLink)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaiforce', `HentaiForce`, 'https://hentaiforce.net', Tags.Language.Multilingual, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}