import { Tags } from '../Tags';
import icon from './FlameComics.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    id: number,
    label : string
}

type JSONManga = {
    series_id: number,
    title : string
}

type JSONChapter = {
    chapter: string,
    title: string
    token: string,
    images: {
        name: string
    }[]
}

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
        return new Manga(this, provider, series_id.toString(), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = await FetchJSON<APIManga[]>(new Request(new URL('./series/', this.apiUrl)));
        return mangas.map(manga => new Manga(this, provider, manga.id.toString(), manga.label));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await FetchWindowScript<JSONChapter[]>(new Request(new URL(`/series/${manga.Identifier}`, this.URI)), '__NEXT_DATA__.props.pageProps.chapters', 1500);
        return chapters.map(episode => new Chapter(this, manga, episode.token, ['Chapter', episode.chapter, episode.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const exclude = [/readonflame[^.]+\.(gif|jpeg|jpg|png|avif)$/, /chevron\.png/];
        const chapterPath = `/series/${chapter.Parent.Identifier}/${chapter.Identifier}`;
        const { images } = await FetchWindowScript<JSONChapter>(new Request(new URL(chapterPath, this.URI)), '__NEXT_DATA__.props.pageProps.chapter', 1500);
        return Object.values(images)
            .filter(image => exclude.none(pattern => pattern.test(image.name)))
            .map(image => new Page(this, chapter, new URL(`/uploads/images/${chapterPath}/${image.name}`, this.cdnURL)));
    }
}