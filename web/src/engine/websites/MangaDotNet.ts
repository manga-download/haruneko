import { Tags } from '../Tags';
import icon from './MangaDotNet.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterLanguageMap = new Map([
    ['ar', [Tags.Language.Arabic]],
    ['bg', []],
    ['cz', []],
    ['da', []],
    ['de', [Tags.Language.German]],
    ['el', []],
    ["en", [Tags.Language.English]],
    ['es', [Tags.Language.Spanish]],
    ['fi', []],
    ['fr', [Tags.Language.French]],
    ['he', []],
    ['hi', []],
    ['hr', []],
    ['hu', []],
    ['id', [Tags.Language.Indonesian]],
    ['it', [Tags.Language.Italian]],
    ['ja', [Tags.Language.Japanese]],
    ['ko', [Tags.Language.Korean]],
    ['lt', []],
    ['ms', []],
    ['nl', []],
    ['no', []],
    ['pl', [Tags.Language.Polish]],
    ['pt', [Tags.Language.Portuguese]],
    ['pt-br', [Tags.Language.Portuguese]],
    ['ro', []],
    ['ru', [Tags.Language.Russian]],
    ['sv', []],
    ['th', [Tags.Language.Thai]],
    ['tl', []],
    ['tr', [Tags.Language.Turkish]],
    ['uk', []],
    ['zh-hk', [Tags.Language.Chinese]],
    ['zh', [Tags.Language.Chinese]],
    ['vi', [Tags.Language.Vietnamese]],
]);

type APIMangas = {
    manga_list: {
        id: number;
        title: string;
    }[];
};

type APIChapters = 	{
	id: number;
	chapter_number: number;
	language: string;
	source: string;
	scanlator_name?: string;
	group_name: string;
}[];

type APIVolumes = 	{
	id: number;
	volume_number: number;
}[];

type APIPages = {
    images: { url: string; }[];
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
        const chaptersData = await FetchJSON<APIChapters>(new Request(new URL(`./manga/${manga.Identifier}/chapters/list`, this.apiURL)));
        const chapters = chaptersData.map(({ id, language, chapter_number: number, source, scanlator_name: scanlator, group_name: group }) => {
            const title = [
                `Chapter ${number}`,
                language && `(${language})`,
                (scanlator || group) && `[${scanlator || group}]`,
            ].joinTitleSegments();
            return new Chapter(this, manga, `./${source === 'user' ? 'uploads' : 'chapters'}/${id}/images`, title, ...chapterLanguageMap.get(language) ?? []);
        });
        const volumesData = await FetchJSON<APIVolumes>(new Request(new URL(`./manga/${manga.Identifier}/volumes`, this.apiURL)));
        const volumes = volumesData.map(({ id, volume_number: number }) => new Chapter(this, manga, `./uploads/${id}/images`, `Volume ${number}`));
        return [...chapters, ...volumes];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { images } = await FetchJSON<APIPages>(new Request(new URL(chapter.Identifier, this.apiURL)));
        return images.map(({ url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}