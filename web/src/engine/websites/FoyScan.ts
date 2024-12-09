import { Tags } from '../Tags';
import icon from './FoyScan.webp';
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
        title: anchor.querySelector<HTMLSpanElement>('span[class*="infoProject_numChapter"]').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/serie\/[^/]+$/, 'h1[class*="infoProject_titulo"]')
@Common.ChaptersSinglePageCSS('div[class*="infoProject_divListChapter"] a[class*="infoProject_divChapter"]', ChapterExtractor)
@Common.PagesSinglePageCSS('main.contenedor img[class*="readChapter_image_"]')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://foyscan.xyz/apiv1/';

    public constructor() {
        super('foyscan', 'FoyScan', 'https://foyscan.xyz', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('searchProject', this.apiUrl)));
        return response.map(manga => new Manga(this, provider, `/serie/${manga.slug}`, manga.name));
    }
}