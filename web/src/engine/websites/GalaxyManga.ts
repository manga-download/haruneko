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

// List of composed references from their discord server
const origins = [
    //'ayoub-zrr.xyz', // => currently dead
    //'flixscans.com', // => currently dead
    'https://galaxymanga.net',
    'https://galaxymanga.org',
    'https://gxcomic.xyz',
    'https://josephbent.com',
    //'snowscans.com', // => re-branded as affiliate website
];

@Common.MangaCSS(new RegExp(`^({origin}|${origins.join('|')})/series/\\d+-\\d+-[^/]+$`), 'main section > div > div.font-semibold')
@Common.ChaptersSinglePageCSS('main section div.overflow-y-auto div.grid > a', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('main > section > div > img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('galaxymanga', 'Galaxy Manga', 'https://galaxymanga.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await Promise.allSettled(origins.map(async origin => {
            const uri = new URL((await fetch(origin, { redirect: 'follow' })).url);
            this.URI.href = uri.origin === origin && uri.pathname !== '/' ? origin : this.URI.href;
        }));
        console.log(`Assigned URL '${this.URI}' to ${this.Title}`);
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