import { Tags } from '../Tags';
import icon from './Komiku.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.replace(/^komik/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'article div#Judul h1 span[itemprop="name"]', MangaLabelExtractor)
@Common.ChaptersSinglePageCSS('table#Daftar_Chapter td.judulseries a')
@Common.PagesSinglePageCSS('div#Baca_Komik img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiku', `Komiku`, 'https://komiku.id', Tags.Language.Indonesian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList : Manga[] = [];
        for (const genre of ['manga', 'manhua', 'manhwa']) {

            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/daftar-komik/?tipe=${genre}`, 'div.ls4 div.ls4j h4 a');
            mangaList.push(...mangas);
        }
        return mangaList;
    }

}
