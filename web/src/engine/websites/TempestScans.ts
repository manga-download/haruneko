import { Tags } from '../Tags';
import icon from './TempestScans.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIChapters = {
    slug: string;
    number: number;
}[];

type APIPages = [{
    pages: {
        imageUrl: string;
    }[];
}];

@Common.MangaCSS(/^{origin}\/explore\/[^/]+$/, 'ol[data-slot="breadcrumb-list"] li:last-of-type', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.trim()
}))
@Common.MangasNotSupported()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://juratempe.st/api/rpc/';

    public constructor() {
        super('tempestscans', 'Tempest Scans', 'https://juratempe.st', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await this.FetchAPI<APIChapters>('./chapter/byMangaSlug', { slug: manga.Identifier });
        return chapters.map(({ slug, number }) => new Chapter(this, manga, slug, `Bölüm ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [{ pages }]= await this.FetchAPI<APIPages>('./release/byChapterSlug', { mangaSlug: chapter.Parent.Identifier, chapterSlug: chapter.Identifier });
        return pages.map(({ imageUrl }) => new Page(this, chapter, new URL(imageUrl)));
    }

    private async FetchAPI<T extends JSONElement>(endpoint: string, payload: JSONElement): Promise<T> {
        return (await FetchJSON<{ json: T }>(new Request(new URL(endpoint, this.apiURL), {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                json: payload
            })
        }))).json;
    }
}