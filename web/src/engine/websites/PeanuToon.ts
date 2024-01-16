import { Tags } from '../Tags';
import icon from './PeanuToon.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResponse<T> = {
    response: {
        result: T[]
    }
}

type APIManga = {
    idx: number,
    title: string
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.dataset.episodeName.trim()
    };
}

@Common.MangaCSS(/^{origin}\/ko\/comic\/detail\/\d+$/, 'div.info_title h2')
@Common.ChaptersSinglePageCSS('div.detail_area a[href*="/view/"]', ChapterExtractor)
@Common.PagesSinglePageCSS('section#viewer-list img.lazyload')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('peanutoon', 'Peanutoon (피너툰)', 'https://www.peanutoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Korean, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const genres = ['전체', 'BL', '로맨스', '성인', 'GL', '드라마', '코믹'];
        const days = ['월', '화', '수', '목', '금', '토', '일', '열흘', '기타'];
        const mangaList: Manga[] = [];
        mangaList.push(... await this.fetchMangasByDays(provider, days));
        mangaList.push(... await this.fetchMangasByGenres(provider, genres));
        return mangaList.distinct();
    }
    async fetchMangasByDays(provider: MangaPlugin, tabs: string[]) {
        const mangaList = [];
        for (const menuName of tabs) {
            const url = new URL(`/api/comic/tab?which=days&locale=ko&menuName=${menuName}&start=&count=`, this.URI);
            const request = new Request(url.href, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const data = await FetchJSON<APIResponse<APIManga>>(request);
            const mangas = data.response.result.map(manga => new Manga(this, provider, `/ko/comic/detail/${manga.idx}/`, manga.title));
            mangaList.push(...mangas);
        }
        return mangaList;
    }

    async fetchMangasByGenres(provider: MangaPlugin, genres: string[]): Promise<Manga[]> {
        const mangaList = [];
        const mangasPerPage = 200;
        for (const genre of genres) {

            for (let run = true, offset = 0; run; offset += mangasPerPage) {
                const url = new URL(`/api/comic/genre?tab=new&genre=${genre}&age_group=&start=${offset}&length=${mangasPerPage}`, this.URI);
                const request = new Request(url.href, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await FetchJSON<APIResponse<APIManga>>(request);
                const mangas = data.response.result.map(manga => new Manga(this, provider, `/ko/comic/detail/${manga.idx}/`, manga.title));
                mangaList.push(...mangas);
                run = mangas.length > 0;
            }

        }
        return mangaList;
    }
}