import { Tags } from '../Tags';
import icon from './PhenixScans.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    mangas: {
        title: string,
        slug: string
    }[]
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLSpanElement>('span.project__chapter-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'h1.project__content-informations-title')
@Common.ChaptersSinglePageCSS('div.project__chapters a.project__chapter', ChapterExtractor)
@Common.PagesSinglePageCSS('img.chapter-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private apiUrl = 'https://api.phenix-scans.com/front/';

    public constructor() {
        super('phenixscans', 'Phenix Scans', 'https://phenix-scans.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await FetchJSON<APIMangas>(new Request(new URL('./manga?page=1&limit=99999&sort=updatedAt', this.apiUrl)));
        return mangas.map(manga => new Manga(this, provider, `/manga/${manga.slug}`, manga.title));
    }

}