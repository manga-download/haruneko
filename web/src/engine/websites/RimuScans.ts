import { Tags } from '../Tags';
import icon from './RimuScans.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    mangas: {
        slug: string;
        title: string;
    }[];
};

type APIChapters = {
    manga: {
        chapters: {
            id: string;
            title: string;
            images: { url: string }[];
        }[];
    };
}

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (meta, uri) => ({ id: uri.pathname.split('/').at(-1), title: meta.content.replace(/\s+-\s+Scan\s+VF\s*$/, '').trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rimuscans', 'RimuScans', 'https://rimuscan.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL('/manga/-', this.URI)), '');
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await FetchJSON<APIMangas>(new Request(new URL('./api/manga?limit=9999', this.URI)));
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { manga: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./api/manga?slug=${manga.Identifier}`, this.URI)));
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { manga: { chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./api/manga?slug=${chapter.Parent.Identifier}`, this.URI)));
        return chapters.find(({ id }) => id === chapter.Identifier).images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}