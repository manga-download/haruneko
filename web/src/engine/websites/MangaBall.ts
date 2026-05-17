import { Tags } from '../Tags';
import icon from './MangaBall.webp';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIMangas = {
    data: APIManga[];
};

type APIManga = {
    _id: string;
    name: string;
};

type APIChapters = {
    ALL_CHAPTERS: {
        translations: {
            name: string;
            language: string;
            url: string;
        }[]
    }[];
}

const chapterLanguageMap = new Map([
    ['ar', Tags.Language.Arabic],
    ['en', Tags.Language.English],
    ['es', Tags.Language.Spanish],
    ['es-419', Tags.Language.Spanish],
    ['fr', Tags.Language.French],
    // [ 'he', Tags.Language.Hebrew ],
    // [ 'hi', Tags.Language.Hindi ],
    ['id', Tags.Language.Indonesian],
    ['pl', Tags.Language.Polish],
    ['pt-br', Tags.Language.Portuguese],
    ['th', Tags.Language.Thai],
    ['vi', Tags.Language.Vietnamese]
]);

@Common.MangaCSS(/^{origin}\/title-detail\/[^/]+\/$/, 'div#comicDetail div.comic-detail-card h6', (element, uri) => ({
    id: uri.pathname.match(/-([^/-]+)\/$/).at(1),
    title: element.textContent.trim()
}))
@Common.PagesSinglePageJS(`chapterImages`, 750)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://mangaball.net/api/v1/';
    private token: string = '';

    public constructor() {
        super('mangaball', 'MangaBall', 'https://mangaball.net', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        this.token = await FetchWindowScript<string>(new Request(this.URI), `document.querySelector('meta[name="csrf-token"]').content.trim()`);
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { data } = await this.FetchAPI<APIMangas>(`./title/search-advanced/`, new URLSearchParams({
                    search_input: '',
                    'filters[sort]': 'updated_chapters_desc',
                    'filters[page]': `${page}`,
                    'filters[tag_included_mode]': 'and',
                    'filters[tag_excluded_mode]': 'and',
                    'filters[contentRating]': 'any',
                    'filters[demographic]': 'any',
                    'filters[person]': 'any',
                    'filters[originalLanguages]': 'any',
                    'filters[publicationYear]': '',
                    'filters[publicationStatus]': 'any',
                    'filters[userSettingsEnabled]': 'false'
                }));
                const mangas = data.map(({ _id, name }) => new Manga(this, provider, _id, name));
                mangas.length > 0 ? yield* mangas : run = false;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { ALL_CHAPTERS } = await this.FetchAPI<APIChapters>('./chapter/chapter-listing-by-title-id/', new URLSearchParams({
            title_id: manga.Identifier,
            userSettingsEnabled: 'false'
        }));

        return ALL_CHAPTERS.reduce((accumulator: Chapter[], entry) => {
            const chapters = entry.translations.map(({ name, language, url }) => new Chapter(this, manga, new URL(url).pathname, [name.trim(), `[${language}]`].join(' ').trim(), ...[chapterLanguageMap.get(language)].filter(Boolean)));
            accumulator.push(...chapters);
            return accumulator;
        }, []);
    }

    private async FetchAPI<T extends JSONElement>(endpoint, body: URLSearchParams): Promise<T> {
        return FetchJSON<T>(new Request(new URL(endpoint, this.apiUrl), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-CSRF-TOKEN': this.token
            },
            body
        }));
    }

}