import * as devalue from 'devalue';
import { Tags } from '../Tags';
import icon from './LectorJPG.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, Page, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type HydratedSvelte = {
    nodes: {
        type: string;
        data: JSONElement;
    }[];
};

type JSONMangas = {
    data: {
        name: string;
        slug: string;
    }[];
    next_cursor: string;
};

type JSONChapters = {
    serie: {
        seasons: {
            chapters: {
                id: number;
                number: number;
            }[];
        }[];
    };
};

type JSONPages = {
    currentChapter: {
        images: string[];
    };
};

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.grid h1.text-xl', (h1, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: h1.innerText.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private apiURL = 'https://visorjpg.lat/_app/remote/xkl77u/';

    public constructor() {
        super('lectorjpg', 'VisorJPG', 'https://visorjpg.lat', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            let cursor: string;
            const uri = new URL('./getSeries', this.apiURL);
            for (let run = true; run;) {
                const payload = devalue.stringify({
                    cursor,
                    perPage: 500,
                    genres: [],
                    name: '',
                });
                uri.searchParams.set('payload', btoa(payload));
                const { result } = await FetchJSON<{ result: string }>(new Request(uri));
                const { data, next_cursor } = <JSONMangas>devalue.parse(result);
                yield* data.map(({ slug, name }) => new Manga(this, provider, slug, name));
                next_cursor ? cursor = next_cursor : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { nodes: [, { data }] } = await FetchJSON<HydratedSvelte>(new Request(new URL(`/series/${manga.Identifier}/__data.json`, this.URI)));
        const { serie: { seasons } } = <JSONChapters>devalue.parse(JSON.stringify(data));
        return seasons.reduce<Chapter[]>((accumulator, season) => {
            const chapters = season.chapters.map(({ id, number }) => new Chapter(this, manga, `${id}`, `Capitulo ${number}`));
            return accumulator.concat(chapters);
        }, []);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { nodes: [, { data }] } = await FetchJSON<HydratedSvelte>(new Request(new URL(`/read/${chapter.Parent.Identifier}/${chapter.Identifier}/__data.json`, this.URI)));
        const { currentChapter: { images } } = <JSONPages>devalue.parse(JSON.stringify(data));
        return images.map(image => new Page(this, chapter, new URL(image)));
    }
}