import { Tags } from '../Tags';
import icon from './RimuScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    slug: string;
    title: string;
    chapters: APIChapter[];
};

type APIMangas = {
    mangas: APIManga[];
};

type APIChapter = {
    id: string;
    title: string;
    images: { url : string }[];
}

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/manga\/[^/]+$/, 'img.object-cover', (img, uri) => ({ id: uri.pathname.split('/').at(-1), title: img.alt.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('rimuscans', 'RimuScans', 'https://rimuscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { mangas } = await this.GetMangasData();
        return mangas.map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    private async GetMangasData(): Promise<APIMangas> {
        return FetchJSON<APIMangas>(new Request(new URL('./api/manga', this.URI)));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = (await this.GetMangasData()).mangas.find(({ slug }) => slug === manga.Identifier);
        return chapters.map(({ id, title }) => new Chapter(this, manga, id, title));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = (await this.GetMangasData()).mangas.find(({ slug }) => slug === chapter.Parent.Identifier).chapters.find(({ id }) => chapter.Identifier === id);
        return images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }

}