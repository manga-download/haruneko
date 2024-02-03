import { Tags } from '../Tags';
import icon from './YugenMangasPT.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    series: APIManga[]
}

type APIManga = {
    name: string,
    slug: string
}

type APIChapters = {
    chapters: APIChapter[]
}

type APIChapter = {
    name: string,
    slug: string
}

type APIPages = {
    chapter_images: string[]
}

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://api.yugenmangas.net.br';

    public constructor() {
        super('yugenmangas-pt', 'YugenMangas (PT)', 'https://yugenmangas.net.br', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExp(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = url.split('/').pop();
        const data = await FetchJSON<APIManga>(new Request(new URL(`/api/serie_details/${slug}`, this.apiUrl), {
            method: 'POST',
        }));
        return new Manga(this, provider, data.slug, data.name.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchJSON<APIMangas>(new Request(new URL('/api/all_series/', this.apiUrl)));
        return series.map(manga => new Manga(this, provider, manga.slug, manga.name.trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL('/api/get_chapters_by_serie/', this.apiUrl), {
            method: 'POST',
            body: JSON.stringify({
                serie_slug: manga.Identifier
            })
        }));
        return chapters
            .sort((chapterA, chapterB) => { return chapterB.name.localeCompare(chapterA.name, undefined, { numeric: true, sensitivity: 'base' }); })
            .map(chapter => new Chapter(this, manga, chapter.slug, chapter.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { chapter_images } = await FetchJSON<APIPages>(new Request(new URL(`/api/serie/${chapter.Parent.Identifier}/chapter/${chapter.Identifier}/images/imgs/`, this.apiUrl), {
            method: 'POST',
        }));
        return chapter_images.map(image => new Page(this, chapter, new URL(image, this.URI)));

    }
}