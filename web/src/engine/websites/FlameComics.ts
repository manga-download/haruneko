import { Tags } from '../Tags';
import icon from './FlameComics.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    id: number;
    label: string;
};

type JSONManga = {
    series_id: number;
    title: string;
};

type JSONChapter = {
    chapter: string;
    title: string;
    token: string;
};

// TODO: Check for possible revision

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly cdnURL = 'https://cdn.flamecomics.xyz';
    private readonly apiUrl = 'https://flamecomics.xyz/api/';

    public constructor() {
        super('flamecomics', 'Flame Comics', 'https://flamecomics.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { series_id, title } = await FetchWindowScript<JSONManga>(new Request(new URL(url)), '__NEXT_DATA__.props.pageProps.series', 1500);
        return new Manga(this, provider, `${series_id}`, title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./series', this.apiUrl)));
        return mangas.map(({ label, id }) => new Manga(this, provider, `${id}`, label));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchWindowScript<JSONChapter[]>(new Request(new URL(`/series/${manga.Identifier}`, this.URI)), '__NEXT_DATA__.props.pageProps.chapters', 1500);
        return chapters.map(({ token, chapter, title }) => new Chapter(this, manga, token, ['Chapter', chapter, title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //we could have used MangaStream.FetchCSS but not without breaking compatibility with old chapters id
        const exclude = [/read[\s_.-]*on[\s_.-]*flame/i, /chevron\.png/];
        const elements = await FetchCSS<HTMLImageElement>(new Request(new URL(`/series/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI)), 'img[my]');
        return elements
            .filter(({ src }) => exclude.none(pattern => pattern.test(src)))
            .map(({ src }) => new Page(this, chapter, new URL(src, this.cdnURL)));
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        return new URL(`/series/${chapter.Parent.Identifier}/${chapter.Identifier}`, this.URI);
    }
}