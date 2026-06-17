import { Tags } from '../Tags';
import icon from './MangaDotNet.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    // [ 'bg', Tags.Language.Bulgarian ],
    // [ 'cz', Tags.Language.Czech ],
    // [ 'da', Tags.Language.Danish ],
    ['de', Tags.Language.German],
    // [ 'el', Tags.Language.Greek ],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    // [ 'fi', Tags.Language.Finnish ],
    ['fr', Tags.Language.French],
    // [ 'he', Tags.Language.Hebrew ],
    // [ 'hi', Tags.Language.Hindi ],
    // [ 'hr', Tags.Language.Croatian ],
    // [ 'hu', Tags.Language.Hungarian ],
    ['id', Tags.Language.Indonesian],
    ['it', Tags.Language.Italian],
    ['ja', Tags.Language.Japanese],
    ['ko', Tags.Language.Korean],
    // [ 'lt', Tags.Language.Lithuanian ],
    // [ 'ms', Tags.Language.Malay ],
    // [ 'nl', Tags.Language.Dutch ],
    // [ 'no', Tags.Language.Norwegian ],
    ['pl', Tags.Language.Polish],
    ['pt', Tags.Language.Portuguese],
    ['pt-br', Tags.Language.Portuguese],
    // [ 'ro', Tags.Language.Romanian ],
    ['ru', Tags.Language.Russian],
    // [ 'sv', Tags.Language.Swedish ],
    ['th', Tags.Language.Thai],
    // [ 'tl' , Tags.Language.Tagalog ],
    ['tr', Tags.Language.Turkish],
    // [ 'uk', Tags.Language.Ukrainian ],
    ['zh-hk', Tags.Language.Chinese],
    ['zh', Tags.Language.Chinese],
    ['vi', Tags.Language.Vietnamese],
]);

type APIManga = {
    id: number;
    title: string;
};

type APIMangas = {
    manga_list: APIManga[];
};

type APIChapter = {
    id: number;
    chapter_number: number;
    language: string;
    source: string;
    scanlator_name?: string;
    group_name: string;
};

type APIVolume = {
    id: number;
    volume_number: number;
};

type ChapterID = {
    id: number;
    source: string;
};

type APIPages = {
    images: { url: string; }[]
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/manga\/\d+$/, 'meta[property="og:title"]', (meta, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: meta.content.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/`;

    public constructor() {
        super('mangadotnet', 'MangaDotNet', 'https://mangadot.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('adultMode', '1')`, 1500);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { manga_list } = await FetchJSON<APIMangas>(new Request(new URL(`./manga?limit=500&page=${page}`, this.apiURL)));
                const mangas = manga_list.map(({ id, title }) => new Manga(this, provider, `${id}`, title));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chaptersData = await FetchJSON<APIChapter[]>(new Request(new URL(`./manga/${manga.Identifier}/chapters/list`, this.apiURL)));
        const chapters = chaptersData.map(({ id, language, chapter_number: number, source, scanlator_name: scanlatorName, group_name: group }) => new Chapter(this, manga, JSON.stringify({ id, source }),
            [`Chapter ${number}`, `[${language}]`, scanlatorName || group].joinTitleSegments(),
            ...[chapterLanguageMap.get(language)].filter(Boolean)
        )).reverse();
        const volumesData = await FetchJSON<APIVolume[]>(new Request(new URL(`./manga/${manga.Identifier}/volumes`, this.apiURL)));
        const volumes = volumesData.map(({ id, volume_number: number }) => new Chapter(this, manga, JSON.stringify({ id, source: 'user' }), `Volume ${number}`));
        return [...chapters, ...volumes];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { id, source } = <ChapterID>JSON.parse(chapter.Identifier);
        const { images } = await FetchJSON<APIPages>(new Request(new URL(`./${source === 'user' ? 'uploads' : 'chapters'}/${id}/images`, this.apiURL)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}