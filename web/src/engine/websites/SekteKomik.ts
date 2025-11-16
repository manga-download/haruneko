import { Tags } from '../Tags';
import icon from './SekteKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.anime__details__title h3')
@Common.MangasMultiPageCSS('div.product__page__content div:not([class*="swiper"]) div div.product__item div.product__item__text a', Common.PatternLinkGenerator('/manga?page={page}'))
@Common.ChaptersSinglePageCSS('div.anime__details__episodes a')
@Common.PagesSinglePageCSS('div.container img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sektekomik', 'SEKTEKOMIK.XYZ', 'https://sektekomik.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}