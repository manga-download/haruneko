import { Tags } from '../Tags';
import icon from './GalaxyManga.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS} from '../platform/FetchProvider';


/*
export type APIMangaClipboard = {
    serie: APIManga
}

export type APIManga = {
    id: number,
    title: string,
    prefix: number
}

export type APIMangas = {
    data: APIManga[]
}

export type APIChapter = {
    id: number,
    title: string,
    name: string
}

export type APIPages = {
    chapter: {
        chapterData: {
            webtoon: string[]
        }
    }
}
*/

/*
type LaravelLivewireMessage = {
    _token?: string,
    components?: {
        snapshot: string,
        effects?: {
            html: string;
        };
    }

    fingerprint: {
        name: string;
    };

    updates?: {
        type: string;
        payload: {
            id: string;
            method: string;
            params: Array<number | string>;
        }
    }[];
}*/

export const categories = ['action', 'romance'];

function ChapterExtractor( anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('span').textContent.trim()
    };
}

@Common.ChaptersSinglePageCSS('div.grid a[wire\\:key]:not(.btn)', ChapterExtractor)
@Common.PagesSinglePageCSS('div[wire\\:key*="image"] img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    protected readonly apiUrl: string;
    protected readonly cdnUrl: string;
    protected readonly mangaRegexp: RegExp;

    public constructor() {
        super('galaxymanga', 'Galaxy Manga', 'https://flixscans.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (const category of categories) {
            for (let page = 1, run = true; run; page++) {
                const mangas = await this.GetMangasFromCategoryPage(page, provider, category);
                mangas.length > 0 ? mangaList.push(...mangas) : run = false;
            }
        }
        return mangaList;
    }

    private async GetMangasFromCategoryPage(page: number, provider: MangaPlugin, category: string): Promise<Manga[]> {
        //document.querySelectorAll('div[wire\\:snapshot][wire\\:effects*="paginators"]')
        const uri = new URL(`/webtoons/${category}/latest?page=${page}`, this.URI);
        const data = await FetchCSS<HTMLAnchorElement>(new Request(uri), 'div.grid div[wire\\:effects="[]"] div div div a');
        return data.map(element => new Manga(this, provider, element.pathname, element.text.trim()));
    }
}