import { Tags } from '../Tags';
import icon from './HentaiHand.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    slug: string;
    title: string;
};

type APIPages = {
    images: { source_url: string; }[];
};

@Common.MangasNotSupported()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaihand', `HentaiHand`, 'https://hentaihand.com', Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Erotica, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+/comic/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { slug, title } = await FetchJSON<APIManga>(new Request(new URL(`/api/comics/${url.split('/').at(-1) }`, this.URI)));
        return new Manga(this, provider, slug, title.trim());

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchJSON<APIPages>(new Request(new URL(`/api/comics/${chapter.Identifier}/images`, this.URI)));
        return images.map(({ source_url: url }) => new Page(this, chapter, new URL(url)));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/en/comic/${chapter.Identifier}`, this.URI);
    }
}
