import { Tags } from '../Tags';
import icon from './TempleScanEsp.webp';
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
        id: anchor.pathname + '?allow=true',
        title: anchor.querySelector<HTMLSpanElement>('span[class*="infoProject_numChapter"]').textContent.trim()
    };
}

@Common.ChaptersSinglePageCSS('div[class*="infoProject_divListChapter"] a[class*="infoProject_divChapter"]', ChapterExtractor)
@Common.PagesSinglePageCSS('main.contenedor img[class*="readChapter_image_"]')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://apis.templescanesp.net/api/';

    public constructor() {
        super('templescanesp', 'Temple Scan (ESP)', 'https://templescanesp.caserosvive.com.ar', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/ver/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return await Common.FetchMangaCSS.call(this, provider, this.CookUrl(url), 'h1[class*="infoProject_titulo"]', undefined, true);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('./searchProject', this.apiUrl)));
        return response.map(manga => new Manga(this, provider, `/ver/${manga.slug}?allow=true`, manga.name));
    }

    private CookUrl(url: string): string {
        const newUrl = new URL(url);
        newUrl.searchParams.set('allow', 'true');
        return newUrl.href;
    }

}