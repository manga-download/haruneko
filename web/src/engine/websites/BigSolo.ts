import { Tags } from '../Tags';
import icon from './BigSolo.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    slug: string;
    title: string;
    chapters: Record<number, APIChapter>;
};

type APIMangas = {
    os: APIManga[];
    series: APIManga[];
};

type APIChapter = {
    title: string;
    licensed: boolean;
    source: {
        id: string;
    };
};

type APIPages = {
    link: string;
}[];

@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bigsolo', 'BigSolo', 'https://bigsolo.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(new URL(url)), '#series-data-placeholder');
        const { title }: APIManga = JSON.parse(script.text);
        return new Manga(this, provider, url.split('/').at(-1), title);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { os, series } = await FetchJSON<APIMangas>(new Request(new URL('/data/series', this.URI)));
        return [...os, ...series].map(({ slug, title }) => new Manga(this, provider, slug, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [script] = await FetchCSS<HTMLScriptElement>(new Request(new URL(manga.Identifier, this.URI)), '#series-data-placeholder');
        const { chapters }: APIManga = JSON.parse(script.text);
        const validChapters = Object.entries(chapters).filter(([_, chapter]) => !chapter.licensed);
        return validChapters
            .map(([key, chapter]) =>
                new Chapter(this, manga, chapter.source.id, [validChapters.length > 1 ? key : '', chapter.title].join(' ').trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchJSON<APIPages>(new Request(new URL(`/api/imgchest-chapter-pages?id=${chapter.Identifier}`, this.URI)));
        return images.map(({ link }) => new Page(this, chapter, new URL(link)));
    }
}