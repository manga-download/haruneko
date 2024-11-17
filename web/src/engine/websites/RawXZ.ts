import { Tags } from '../Tags';
import icon from './RawXZ.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/\(Raw.*Free\)/i, '').trim();
}

@Madara.ChaptersSinglePageAJAXv2()
@MangaStream.PagesSinglePageCSS([/07c400d9d4ae35c494529\.jpg$/], 'div.page-break img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rawxz', 'RawXZ', 'https://rawxz.to', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/manga/[^/]+/$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const manga = await Madara.FetchMangaCSS.call(this, provider, url, 'ol.breadcrumb li:last-of-type a');
        return new Manga(this, provider, manga.Identifier, CleanTitle(manga.Title));
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await Madara.FetchMangasMultiPageAJAX.call(this, provider);
        return mangas.map(manga => new Manga(this, provider, manga.Identifier, CleanTitle(manga.Title)));
    }

}