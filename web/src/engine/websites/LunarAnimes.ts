import { Tags } from '../Tags';
import icon from './LunarAnimes.webp';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { DRMProvider } from './LunarAnimes.DRM';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

type APIMangas = {
    manga: APIManga[];
};

type APIManga = {
    title: string;
    slug: string;
};

type APIChapters = {
    data: {
        chapter_number: number;
        language: string;
    }[]
};

const chapterLanguageMap = new Map([
    ['zh', Tags.Language.Chinese],
    ['en', Tags.Language.English],
    ['id', Tags.Language.Indonesian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['ru', Tags.Language.Russian],
    ['es', Tags.Language.Spanish],
    ['th', Tags.Language.Thai],
    ['tr', Tags.Language.Turkish],
    ['vi', Tags.Language.Vietnamese],
]);

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`document.documentElement.innerHTML.includes('Security Check')`);
    return result ? FetchRedirection.Interactive : undefined;
}, /https:\/\/(?:www\.)?lunaranime\.ru/);

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/[^/]+$/, 'meta[property="og:title"]', (element, uri) => ({ id: uri.pathname.split('/').at(-1), title: element.content.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    readonly #drm = new DRMProvider(this.URI, new URL('https://api.lunaranime.ru/api/manga/'));

    public constructor() {
        super('lunaranimes', 'Lunar Animes', 'https://lunaranime.ru', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        await this.#drm.Initialize();
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { manga } = await this.#drm.FetchSigned<APIMangas>(`./search?page=${page}&limit=100&sort=relevance`);
                const mangas = manga.map(({ slug, title }) => new Manga(this, provider, slug, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { data } = await this.#drm.FetchSigned<APIChapters>(`./${manga.Identifier}`);
        return data.map(({ chapter_number: chapterNumber, language }) => {
            return new Chapter(this, manga, `/manga/${manga.Identifier}/${chapterNumber}?lang=${language}`, `Chapter ${chapterNumber} (${language})`,
                ...[chapterLanguageMap.get(language)].filter(Boolean));
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await this.#drm.CreateImageLinks(new URL(chapter.Identifier, this.URI));
        return pages.map(image => new Page(this, chapter, new URL(image), { Referer: this.URI.href }));
    }
}