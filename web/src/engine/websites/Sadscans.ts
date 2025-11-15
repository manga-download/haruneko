import { Tags } from '../Tags';
import icon from './Sadscans.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    result: {
        data: {
            json: T
        }
    }
}[];

type APIChapters = APIResult<{
    chapters: {
        href: string;
        name: string;
        no: number;
    }[]
}>;

function MangaInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector<HTMLHeadingElement>('h3').textContent.trim()
    };
};

@Common.MangaCSS(/{origin}\/seriler\/[^/]+$/, 'title', (el, uri) => ({ id: uri.pathname, title: el.textContent.split('- SADSCANS').at(0).trim() }))
@Common.MangasSinglePageCSS('/seriler', 'a.block.group', MangaInfoExtractor)
@Common.PagesSinglePageJS(`[...document.querySelectorAll('.reader-img')].map(image => image.src);`, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://sadscans.net/api/trpc/';

    public constructor() {
        super('sadscans', `Sadscans`, 'https://sadscans.net', Tags.Language.Turkish, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const data = await this.FetchAPI<APIChapters>('./seriesSingle.getSeriesData?batch=1', {
            0: {
                json: {
                    sef: manga.Identifier.split('/').at(-1)
                }
            }
        });
        return data.pop().result.data.json.chapters.map(chapter => new Chapter(this, manga, chapter.href, `${chapter.no}. Bölüm - ${chapter.name}`));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, input: JSONElement): Promise<T> {
        const url = new URL(endpoint, this.apiUrl);
        url.searchParams.set('input', JSON.stringify(input));
        return await FetchJSON<T>(new Request(url));
    }
}