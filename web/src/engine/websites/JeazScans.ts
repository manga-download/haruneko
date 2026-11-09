import { Tags } from '../Tags';
import icon from './JeazScans.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import type { Priority } from '../taskpool/DeferredTask';
import { Fetch, FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

type APIChapters = {
    chapters: {
        title: string;
        number: number;
    }[];
};

type MangaInfos = {
    slug: string;
    id: number;
};

@Common.MangaCSS(/^{origin}\/manga(\/[^/]+|\.php\?id=\d+)$/, 'h1.uppercase.blood-title', Common.WebsiteInfoExtractor({ includeSearch: true }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.directory-card', Common.PatternLinkGenerator('/directorio.php?page={page}'), 0, anchor => ({
    id: `/manga.php${anchor.search}`, title: anchor.querySelector('h3[title]').getAttribute('title').trim()
}))
@Common.PagesSinglePageCSS<HTMLImageElement>('div.page-container img', img => img.dataset.src ?? img.src)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('jeazscans', 'Jeaz Scans', 'https://lectorhub.j5z.xyz', Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        // if manga.Identifier is manga.php?id=number, we need the slug
        // if manga.Identifier is /my-crappy-isekai-harem, we need the id
        // => in any case, get both. (manga.php?id=number redirect to slug)
        const { id, slug } = await FetchWindowScript<MangaInfos>(new Request(new URL(manga.Identifier, this.URI)), '({ slug: location.pathname, id: MANGA_ID });', 500);
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset+=100 ) {
                const { chapters: chaptersData } = await FetchJSON<APIChapters>(new Request(new URL(`./api_capitulos_manga.php?manga_id=${id}&offset=${offset}&limit=100&orden=desc`, this.URI)));
                const chapters = chaptersData.map(({ title, number }) => new Chapter(this, manga, `${slug.replace('/manga/', '/leer/')}/capitulo-${number}`, title));
                chapters.length > 0 ? yield* chapters : run = false;
            }
        }.call(this));
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        return this.imageTaskPool.Add(async () => {
            const response = await Fetch(new Request(page.Link, {
                signal, headers: {
                    'Referer': this.URI.href,
                    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                    'Sec-Fetch-Mode': 'no-cors',
                    'Sec-Fetch-Dest': 'image',
                    'Sec-Fetch-Site': 'same-origin'
                }
            }));
            return response.blob();
        }, priority, signal);
    }
}