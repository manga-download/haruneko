import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    response: T
}

type APIManga = {
    name: string,
    slug: string
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('span[class*="sm:text-base"]').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/ver\/[^/]+$/, 'meta[property="og:title"]')
@Common.ChaptersSinglePageCSS('div.grid a[href*="/ver/"]', ChapterExtractor)
@Common.PagesSinglePageCSS('main.contenedor img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://apis.pichulasjpg.xyz/api/';

    public constructor() {
        super('lectorjpg', 'LectorJPG', 'https://lectorjpg.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('./searchProject', this.apiUrl)));
        return response.map(manga => new Manga(this, provider, `/ver/${manga.slug}`, manga.name));
    }
}