import { Tags } from '../Tags';
import icon from './MangasBrasuka.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchNextJS, FetchWindowScript } from '../platform/FetchProvider';

type HydratedMangas = {
    series: {
        slug: string;
        title: string;
    }[];
};

type HydratedManga = {
    chapters: {
        number: string;
    }[];
};

type HydratedPages = {
    pages: {
        url: string;
    }[];
};

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]')
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('mangasbrasuka', 'Mangas Brasuka', 'https://mangasbrasuka.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
        }
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('mnx_adulto', '1')`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { series } = await FetchNextJS<HydratedMangas>(new Request(new URL('/catalogo', this.URI)), data => 'series' in data);
        return series.map(({ slug, title }) => new Manga(this, provider, `/manga/${slug}`, title));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters } = await FetchNextJS<HydratedManga>(new Request(new URL(manga.Identifier, this.URI)), data => 'chapters' in data);
        return chapters.map(({ number }) => new Chapter(this, manga, `${manga.Identifier}/ler/${number}`, `Capítulo ${number}`));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterURL = new URL(chapter.Identifier, this.URI);
        await FetchWindowScript<void>(new Request(chapterURL), `
            new Promise(async (resolve, reject) => {
                try {
                    await window.cookieStore.set('mnx_gate_${chapter.Identifier.split('/').at(-1)}', '1');
                    resolve();
                } catch(error) {
                    reject(error);
                }
            });
        `);
        const { pages } = await FetchNextJS<HydratedPages>(new Request(chapterURL), data => 'pages' in data);
        return pages.map(({ url }) => new Page(this, chapter, new URL(url), { Referer: this.URI.href }));
    }
}