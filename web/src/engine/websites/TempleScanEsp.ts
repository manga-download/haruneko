import { Tags } from '../Tags';
import icon from './TempleScanEsp.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    response: {
        name: string,
        slug: string,
    }[]
}

class CookURL extends URL {

    public constructor(url: string | URL, base?: string | URL) {
        super(url, base);
        this.searchParams.set('allow', 'true');
    }

    public get PathSearch() {
        return this.pathname + this.search;
    }
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: new CookURL(anchor.href).PathSearch,
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
        return await Common.FetchMangaCSS.call(this, provider, new CookURL(url).href, 'h1[class*="infoProject_titulo"]', undefined, true);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIMangas>(new Request(new URL('./searchProject', this.apiUrl)));
        return response.map(manga => new Manga(this, provider, new CookURL('/ver/' + manga.slug, this.URI).PathSearch, manga.name));
    }
}