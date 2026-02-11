import { Tags } from '../Tags';
import icon from './MangaPlusCreators.webp';
import { FetchCSS, FetchJSON } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type MangaPlugin, Manga, type Chapter, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type JSONPages = {
    pc: {
        image_url: string;
    }[],
    sp: {
        image_url: string;
    }[],
};

type APIMangas = {
    titles: {
        contents_id: string;
        title: string;
        language: string;
    }[]
};

function MangaExtractor(element: HTMLElement, uri: URL) {
    return {
        id: uri.pathname,
        title: [element.querySelector('.title').textContent.trim(), `(${element.querySelector('.book-locale').textContent.toLowerCase().trim()})`].join(' ').trim()
    };
}

@Common.MangaCSS(/^{origin}\/titles\/[^/]+$/, 'div.book-contents', MangaExtractor)
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('a.mod-item-series', Common.PatternLinkGenerator('{id}?page={page}'), 0, anchor => ({ id: anchor.pathname, title: anchor.querySelector('.number').textContent.trim() }))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://mangaplus-creators.jp/api/';

    public constructor() {
        super('mangapluscreators', 'Manga Plus Creators', 'https://mangaplus-creators.jp', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (const language of ['en', 'es']) {
                for (const genre of ['fantasy', 'action', 'romance', 'horror', 'slice_of_life', 'comedy', 'sports', 'sf', 'mystery', 'others']) {
                    for (let page = 1, run = true; run; page++) {
                        const { titles } = await FetchJSON<APIMangas>(new Request(new URL(`./genres/${genre}/titles?page=${page}&l=${language}`, this.apiUrl)));
                        const mangas = titles.map(({ contents_id: id, title, language }) => new Manga(this, provider, `/titles/${id}`, [title, `(${language.toLowerCase()})`].join(' ').trim()));
                        mangas.length > 0 ? yield* mangas : run = false;
                    }
                }
            }
        }.call(this))).distinct();
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [viewer] = await FetchCSS(new Request(new URL(chapter.Identifier, this.URI)), 'div[react="viewer"]');
        const { pc, sp }: JSONPages = viewer.dataset.pages ? JSON.parse(viewer.dataset.pages) : {};
        return (pc ?? sp ?? []).map(({ image_url: img }) => new Page(this, chapter, new URL(img)));
    }
}