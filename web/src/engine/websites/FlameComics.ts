import { Tags } from '../Tags';
import icon from './FlameComics.webp';
import { Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type JSONMangas = {
    pageProps: {
        series : JSONManga[]
    }
}

type JSONMangaDetails = {
    pageProps: {
        series: JSONManga,
        chapters: JSONChapter[]
    }
}

type JSONChapterDetails = {
    pageProps: {
        chapter: JSONChapter
    }
}

type JSONManga = {
    series_id: number,
    title: string,
}

type JSONChapter = {
    token: string
    chapter: string,
    title: string,
    images: Record<string, JSONImage>
}

type JSONImage = {
    name : string
}

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {
    private nextBuild = 'J5IvkmIUIIRR6fxzIaczb';
    private readonly cdnURL = 'https://cdn.flamecomics.xyz';

    public constructor() {
        super('flamecomics', 'Flame Comics', 'https://flamecomics.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.nextBuild = await FetchWindowScript(new Request(new URL(this.URI)), `__NEXT_DATA__.buildId`, 2500) ?? this.nextBuild;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/\\d+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const mangaId = url.split('/').at(-1);
        const { pageProps: { series } } = await FetchJSON<JSONMangaDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/series/${mangaId}.json`, this.URI)));
        return new Manga(this, provider, series.series_id.toString(), series.title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { pageProps: { series } } = await FetchJSON<JSONMangas>(new Request(new URL(`/_next/data/${this.nextBuild}/browse.json`, this.URI)));
        return series.map(serie => new Manga(this, provider, serie.series_id.toString(), serie.title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { pageProps: { chapters } } = await FetchJSON<JSONMangaDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/series/${manga.Identifier}.json`, this.URI)));
        return chapters.map(episode => new Chapter(this, manga, episode.token, ['Chapter', episode.chapter, episode.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const exclude = [/readonflame[^.]+\.(gif|jpeg|jpg|png|avif)$/, /chevron\.png/];
        const { pageProps: { chapter: { images } } } = await FetchJSON<JSONChapterDetails>(new Request(new URL(`/_next/data/${this.nextBuild}/series/${chapter.Parent.Identifier}/${chapter.Identifier}.json`, this.URI)));
        return Object.values(images)
            .filter(image => exclude.none(pattern => pattern.test(image.name)))
            .map(image => new Page(this, chapter, new URL(`/series/${chapter.Parent.Identifier}/${chapter.Identifier}/${image.name}`, this.cdnURL)));
    }
}