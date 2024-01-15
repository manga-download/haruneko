import { Tags } from '../Tags';
import icon from './Komiku.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const paths = ['manga', 'manhua', 'manhwa'];

function MangaLabelExtractor(element: HTMLElement) {
    return element.textContent.replace(/^komik/i, '').trim();
}

@Common.MangaCSS(/^{origin}/, 'article header#Judul h1[itemprop="name"]', MangaLabelExtractor)
@Common.ChaptersSinglePageCSS('table#Daftar_Chapter td.judulseries a')
@Common.PagesSinglePageCSS('section#Baca_Komik img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komiku', `Komiku`, 'https://komiku.id', Tags.Language.Indonesian, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (const genre of paths) {

            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, `/daftar-komik/?tipe=${genre}`, 'div.ls4 div.ls4j h4 a');
            mangaList.push(...mangas);
        }
        return mangaList;
    }

}
