import { Tags } from '../Tags';
import icon from './WebComicsApp.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    code: number;
    data: T;
};

type APIChapters = APIResult<{
    list: {
        index: number;
        chapter_id: string;
        name: string;
    }[];
}>;

type APIPages = APIResult<{
    manga_name: string;
    chapter_name: string;
    pages: {
        src: string;
    }[];
}>;

@Common.MangaCSS(/^{origin}\/comic\/[^/]+\/[^/]+$/, 'div.book-info div.card-info div.info h5', (el, uri) => ({
    id: uri.pathname.split('/').at(-1),
    title: el.textContent.trim()
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.list-item a', Common.PatternLinkGenerator('/genres/All/All/Popular/{page}'), 0, anchor => ({
    id: anchor.pathname.split('/').at(-1),
    title: anchor.querySelector<HTMLHeadingElement>('div.item-info h2.info-title').textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://popeye.webcomicsapp.com/api/';

    public constructor() {
        super('webcomicsapp', 'WebComicsApp', 'https://www.webcomicsapp.com', Tags.Language.English, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { code, data: { list } } = await FetchJSON<APIChapters>(new Request(new URL(`./chapter/list?manga_id=${manga.Identifier}`, this.apiUrl)));
        return code == 1000 ? list.map(({ index, name }) => new Chapter(this, manga, `${index}`, name)) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { code, data: { pages } } = await FetchJSON<APIPages>(new Request(new URL(`./chapter/detail?manga_id=${chapter.Parent.Identifier}&index=${chapter.Identifier}`, this.apiUrl)));
        return code == 1000 ? pages.map(({ src }) => new Page(this, chapter, new URL(src))) : [];
    }

    public override async GetChapterURL(chapter: Chapter): Promise<URL> {
        const slugify = (s: string) => s.replace(/[^\w\s]+/g, '-');
        const { data: { manga_name, chapter_name } } = await FetchJSON<APIPages>(new Request(new URL(`./chapter/detail?manga_id=${chapter.Parent.Identifier}&index=${chapter.Identifier}`, this.apiUrl)));
        return new URL(`/view/${slugify(manga_name)}/${chapter.Identifier}/${chapter.Parent.Identifier}-${slugify(chapter_name)}`, this.URI);
    }
}