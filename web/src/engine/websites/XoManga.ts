import { Tags } from '../Tags';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import icon from './XoManga.webp';
import * as Common from './decorators/Common';

type JSONMangas = {
    latest: JSONManga[];
};

type JSONManga = {
    title: string;
    link: string;
    chapters_list: JSONChapter[];
};

type JSONChapter = {
    chapter: number;
};

type JSONPages = {
    images: string[];
};

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xomanga', 'XoManga', 'https://xomanga.site', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/details\\?id=`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const slug = new URL(url).searchParams.get('id');
        const { title } = await FetchJSON<JSONManga>(new Request(new URL(`./manga/${slug}/details.json`, this.URI)));
        return new Manga(this, provider, slug, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { latest } = await FetchJSON<JSONMangas>(new Request(new URL('index.json', this.URI)));
        return latest.map(({ link, title }) => new Manga(this, provider, new URL(link, this.URI).searchParams.get('id'), title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters_list } = await FetchJSON<JSONManga>(new Request(new URL(`./manga/${manga.Identifier}/details.json`, this.URI)));
        return chapters_list.map(({ chapter }) => new Chapter(this, manga, `${chapter}`, `Chapter ${chapter}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchJSON<JSONPages>(new Request(new URL(`./manga/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}.json`, this.URI)));
        return images.map(image => new Page(this, chapter, new URL(image, this.URI)));
    }
}