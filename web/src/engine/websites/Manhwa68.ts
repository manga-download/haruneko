import { Tags } from '../Tags';
import icon from './Manhwa68.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwa68', 'Manhwa68', 'https://manhwa68.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url : string): Promise<Manga> {
        const manga = await Madara.FetchMangaCSS.call(this, provider, url, 'ol.breadcrumb li:last-of-type a');
        return new Manga(this, provider, manga.Identifier, manga.Title.replace(/ END$/i, '').trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Madara.FetchMangasMultiPageAJAX.call(this, provider);
        return mangas.map(manga => new Manga(this, provider, manga.Identifier, manga.Title.replace(/ END$/i, '').trim()));
    }

}