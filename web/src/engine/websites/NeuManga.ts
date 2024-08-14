import { Tags } from '../Tags';
import icon from './NeuManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.anime__details__title h3')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.product__page__content div:not([class]) div.product__item h5 a')
@Common.ChaptersSinglePageCSS('div.anime__details__episodes a')
@Common.PagesSinglePageCSS('div.read-img img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('neumanga', `NeuManga`, 'https://neumanga.xyz', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
