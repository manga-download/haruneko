import { Tags } from '../Tags';
import icon from './SekteKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.anime__details__title h3')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.product__page__content div:not([class*="swiper"]) div div.product__item div.product__item__text a')
@Common.ChaptersSinglePageCSS('div.anime__details__episodes a')
@Common.PagesSinglePageCSS('div.container img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sektekomik', 'SEKTEKOMIK.XYZ', 'https://sektekomik.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}