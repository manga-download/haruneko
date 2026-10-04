import { Tags } from '../Tags';
import icon from './NHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/g\/\d+\/$/, 'div#info h1.title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageCSS<HTMLImageElement>('div.thumbs img.lazyload', image =>
    (image.dataset.src || image.src).replace(/\/t(\d+)\./, '/i$1.').replace(/\/(\d+)t\./, '/$1.').replace(/(\.[a-z]+){2,}$/, '$1')
)
@Common.ImageElement()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nhentai', 'NHentai', 'https://nhentai.net', Tags.Media.Manga, Tags.Media.Cartoon, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}