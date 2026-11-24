import { Tags } from '../Tags';
import icon from './KaktusToon.webp';
import { FetchJSON } from '../platform/FetchProvider';
import { type MangaPlugin, Manga, Chapter, Page, DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type APIManga = {
    name: string;
    lang: string;
    slug: string;
    chapters: {
        id: string;
        number: string;
        slug: string;
    }[];
};

type APIPages = {
    pages: {
        tr_url: string;
    }[];
};

const languageMap = new Map([
    ['es', Tags.Language.Spanish],
    ['pt', Tags.Language.Portuguese],
    ['tr', Tags.Language.Turkish],
]);

@Common.MangaCSS(/^{origin}\/((es|pt)\/)?anime\/[^/]+$/, 'nav > span.text-foreground', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiURL = `${this.URI.origin}/api/public/`;

    public constructor() {
        super('kaktustoon', 'KaktusToon', 'https://kaktustoon.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese, Tags.Language.Turkish, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (const language of languageMap.keys()) {
                const mangasData = await FetchJSON<APIManga[]>(new Request(new URL(`./series?lang=${language}`, this.apiURL)));
                const mangas = mangasData.map(({ slug, name }) => new Manga(this, provider, slug, name));
                yield* mangas;
            }
        }.call(this));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { chapters, lang } = await FetchJSON<APIManga>(new Request(new URL(`./series/${manga.Identifier}`, this.apiURL)));
        return chapters
            .sort((self, other) => parseFloat(other.number) - parseFloat(self.number))
            .map(({ slug, number }) => new Chapter(this, manga, slug, `Chapter ${number}`), ...[languageMap.get(lang)].filter(Boolean));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { pages } = await FetchJSON<APIPages>(new Request(new URL(`./series/${chapter.Parent.Identifier}/chapters/${chapter.Identifier}`, this.apiURL)));
        return pages.map(({ tr_url: url }) => new Page(this, chapter, new URL(url, this.URI)));
    }
}