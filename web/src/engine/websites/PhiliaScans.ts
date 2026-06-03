import { Tags } from '../Tags';
import icon from './PhiliaScans.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchNextJS } from '../platform/FetchProvider';

type HydratedChapters = {
    langChapters: {
        slug: string;
        title: string;
        number: string;
    }[];
};

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/series\/[^/]+$/, 'div.detail-cover img', (img, uri) => ({
    id: uri.pathname,
    title: img.alt.trim()
}))
@Common.PagesSinglePageCSS('img.chapter-page-img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('philiascans', 'Philia Scans', 'https://philiascans.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const doc = await FetchHTML(new Request(new URL(`/all-mangas?page=${page}`, this.URI)));
                const mangaInfos = [...doc.querySelectorAll<HTMLDivElement>('div:has(div.manga-card-info)')];
                const mangasSkeletons = [...doc.querySelectorAll<HTMLAnchorElement>('a.manga-card, a[href^="/series/"]')];
                const mangas = mangasSkeletons.map(manga => {
                    let title = manga.querySelector<HTMLElement>('.card-title')?.innerText.trim();
                    if (!title) {
                        const titleId = manga.querySelector('template:last-of-type').id.replace(/^P/, 'S');
                        title = mangaInfos.find(el => el.id === titleId).querySelector<HTMLElement>('.card-title')?.innerText.trim();
                    }
                    return new Manga(this, provider, manga.pathname, title);
                });
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { langChapters } = await FetchNextJS<HydratedChapters>(new Request(new URL(manga.Identifier, this.URI)), data => 'langChapters' in data);
        return langChapters.map(({ slug, title, number }) => new Chapter(this, manga, `${manga.Identifier}/${slug}`, [`Ch.${number}`, title].joinTitleSegments()));
    }
}