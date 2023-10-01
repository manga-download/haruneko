import { Tags } from '../Tags';
import icon from './SekteKomik.webp';
import { type Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/sektekomik\.xyz\/manga\/[^/]+$/, 'div.anime__details__title h3')
@Common.PagesSinglePageCSS('div.container img[onerror]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sektekomik', 'SEKTEKOMIK.XYZ', 'https://sektekomik.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]>
    {
        let mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, '/manga?page={page}', 'div.product__page__content div:not([class*="swiper"]) div div.product__item div.product__item__text a');
        mangas = mangas.filter((value, index, self) =>
            index === self.findIndex((t) =>t.Identifier === value.Identifier )
        );
        return mangas;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        let chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'div.anime__details__episodes a');
        chapters = chapters.filter((value, index, self) =>
            index === self.findIndex((t) =>t.Identifier === value.Identifier)
        );
        return chapters;
    }

}