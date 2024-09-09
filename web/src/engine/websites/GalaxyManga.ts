import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLSpanElement>('div > div > span').innerText,
    };
}

@Common.MangaCSS(/^{origin}\/series\/\d+-\d+-[^/]+$/, 'main section > div > div.font-semibold')
@Common.ChaptersSinglePageCSS('main section div.overflow-y-auto div.grid > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('main > section > div > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('galaxymanga', 'Galaxy Manga', 'https://galaxymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const category of [ 'manga', 'action', 'romance' ]) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/latest?main_genres=${category}&page={page}`, 'section.container div.grid div.flex > div.px-1 > a', 1);
            mangaList.push(...mangas);
        }
        return mangaList;
    }
}