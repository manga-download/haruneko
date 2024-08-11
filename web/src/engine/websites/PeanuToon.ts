import { Tags } from '../Tags';
import icon from './PeanuToon.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResponse<T> = {
    response: {
        result: T
        end: boolean,
        success: boolean
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
        const mangaList: Manga[] = [];
        const mangasPerPage = 200;

        for (let run = true, offset = 0; run; offset += mangasPerPage) {
            const request = new Request(new URL(`/api/comic/genre?tab=new&finish=off&start=${offset}&length=${mangasPerPage}`, this.URI), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            const { response: { result, end, success } } = await FetchJSON<APIResponse<APIManga[]>>(request);
            if (success) mangaList.push(...result.map(manga => new Manga(this, provider, `/ko/comic/detail/${manga.idx}/`, manga.title)));
            run = !end;
        }
        return mangaList.distinct();
    }

}