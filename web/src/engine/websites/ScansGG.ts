import { Tags } from '../Tags';
import icon from './ScansGG.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Delay } from '../BackgroundTimers';

type APIResult<T> = {
    data: T;
};

type APIManga = {
    id: number;
    title: string;
};

type APIChapter = {
    id: number;
    title: string;
    number: string;
    //language: string; // only english for now?
    group: {
        title: string;
        id: number;
    };
};

type APIChapters = APIResult<APIChapter[]>;
type APIMangas = APIResult<APIManga[]>;

@Common.MangaCSS(/^{origin}\/series\/\d+-[^/]+$/, 'div.series-overview-content h1', (el, uri) => ({
    id: uri.pathname.match(/\/series\/(\d+)/).at(1),
    title: el.textContent.trim()
}))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.grid img.w-full.object-cover')].map(img => img.src);`, 2000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiURL = 'https://api.scans.gg/';

    public constructor() {
        super('scansgg', 'Scans.GG', 'https://scans.gg', Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
        const groupCount = new Set(data.map(({ group: { id: groupId } }) => groupId)).size;
        return data.map(({ title, id, number, group: { title: groupTitle } }) => new Chapter(this, manga, `/series/${manga.Identifier}/${id}`,
            [`Chapter ${number}`, title, groupCount > 1 ? `[${groupTitle}]` : undefined].filter(Boolean).join(' ').trim()));
    }
}