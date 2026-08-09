import { Tags } from '../Tags';
import icon from './ScansGG.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    data: T;
};

type APIMangas = APIResult<{
    id: number;
    title: string;
}[]>;

type APIChapters = APIResult<{
    id: number;
    title: string;
    number: string;
    group: {
        title: string;
    };
}[]>;

@Common.MangaCSS(/^{origin}\/series\/\d+-[^/]+$/, 'div.series-overview-content h1', (el, uri) => ({
    id: uri.pathname.match(/\/series\/(\d+)/).at(1),
    title: el.textContent.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.grid img.w-full.object-cover')].map(img => img.src);`, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.scans.gg/';

    public constructor() {
        super('scansgg', 'Scans.GG', 'https://scans.gg', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `
            localStorage.setItem('excludedTags', '[]');
            localStorage.setItem('excludedTagsSet', '1');
        `);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangasPerPage = 1000;
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let offset = 0, run = true; run; offset += mangasPerPage) {
                await Delay(500);
                const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./series?limit=1000&offset=${offset}`, this.apiURL)));
                const mangas = data.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await FetchJSON<APIChapters>(new Request(new URL(`./chapters?series_id=${manga.Identifier}&group_details=true&limit=9999&page=1`, this.apiURL)));
        return data.map(({ id, number, title, group }) => new Chapter(this, manga, `/series/${manga.Identifier}/${id}`, [
            'Chapter',
            number,
            title,
            group?.title && `[${group.title}]`
        ].joinTitleSegments()));
    }
}