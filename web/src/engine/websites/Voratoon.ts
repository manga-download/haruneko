import { Tags } from '../Tags';
import icon from './Voratoon.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import { FetchNextJS } from '../platform/FetchProvider';
import * as Common from './decorators/Common';

type HydratedData = {
    initialData: {
        series: {
            id: number;
            data: {
                title: string;
                slug: string;
            };
        }[];
        chapter: {
            data: {
                images: string[];
            };
        };
    };
};

@Common.ChaptersSinglePageJS(`[...document.querySelectorAll('ul.chapter-list li a.chapter-item')].map(link => ({id: link.pathname, title: link.querySelector('.chapter-title').textContent.trim()}));`, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikcast', 'Voratoon', 'https://13.voratoon.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Indonesian, Tags.Source.Aggregator, Tags.Accessibility.DomainRotation);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return new RegExpSafe(`^${this.URI.origin}/series/[^/]+$`).test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const { initialData: { series } } = await FetchNextJS<HydratedData>(new Request(new URL(url)), data => 'initialData' in data);
        return new Manga(this, provider, new URL(url).pathname, series[0].data.title.trim());
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { initialData: { series } } = await FetchNextJS<HydratedData>(new Request(new URL(`/browse?page=${page}`, this.URI)), data => 'initialData' in data);
                const mangas = series.map(({ data: { title, slug } }) => new Manga(this, provider, `/series/${slug}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { initialData: { chapter: { data: { images } } } } = await FetchNextJS<HydratedData>(new Request(new URL(chapter.Identifier, this.URI)), data => 'initialData' in data);
        return images.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}