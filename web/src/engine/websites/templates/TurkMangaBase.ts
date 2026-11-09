// ...

import * as devalue from 'devalue';
import { FetchJSON } from '../../platform/FetchProvider';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';

type HydratedSvelte = {
    nodes: {
        type: string;
        data: JSONElement;
    }[];
};

type APIMangas = {
    series: {
        id: number;
        slug: string;
        name: string;
    }[];
};

type APIChapters = {
    series: {
        SeriesEpisode: {
            order: number;
            slug: string;
        }[];
    };
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'nav span', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.textContent.trim() }))
@Common.PagesSinglePageCSS('div.manga-reader-container div.ep-item img')
@Common.ImageAjax()
export class TurkMangaBase extends DecoratableMangaScraper {

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { nodes: [, , { data }] } = await FetchJSON<HydratedSvelte>(new Request(new URL(`/manga/__data.json?page=${page}`, this.URI)));
                const { series } = <APIMangas>devalue.parse(JSON.stringify(data));
                const mangas = series.map(({ slug, name }) => new Manga(this, provider, slug, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { nodes: [, , { data }] } = await FetchJSON<HydratedSvelte>(new Request(new URL(`/manga/${manga.Identifier}/__data.json`, this.URI)));
        const { series: { SeriesEpisode } } = <APIChapters>devalue.parse(JSON.stringify(data));
        return SeriesEpisode.map(({ slug, order }) => new Chapter(this, manga, `/manga/${manga.Identifier}/${slug}`, `Bölüm ${order}`));
    }
}