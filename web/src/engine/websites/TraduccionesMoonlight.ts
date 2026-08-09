import { Tags } from '../Tags';
import icon from './TraduccionesMoonlight.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

// TODO: this website has Novels
type APIResult<T> = {
    response: T;
};

type APIManga = {
    name: string;
    slug: string;
};

type APIChapter = {
    pages: {
        urlImg: string;
    }
};

@Common.MangaCSS(/^{origin}\/ver\/[^/]+$/, 'title', (element, uri) => ({ id: uri.pathname, title: element.textContent.split('|').at(0).trim() }))
@Common.ChaptersSinglePageJS(`
    new Promise(resolve => {
        resolve([...document.querySelectorAll('div.grid div.group a[href*="/ver/"]')].map(chapter => {
            return {
                id: chapter.pathname,
                title: chapter.querySelector('span.truncate').textContent.trim()
            };
        }));
    });`
, 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly apiUrl = 'https://apis.traduccionesmoonlight.com/api/';

    public constructor() {
        super('traduccionesmoonlight', 'Traducciones Moonlight', 'https://traduccionesmoonlight.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const { response } = await FetchJSON<APIResult<APIManga[]>>(new Request(new URL('./searchProject', this.apiUrl)));
        return response.map(({ slug, name }) => new Manga(this, provider, `/ver/${slug}`, name));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const { response: { pages: { urlImg } } } = await FetchJSON<APIResult<APIChapter>>(new Request(new URL(chapter.Identifier.replace('/ver/', '/api/showProject/'), this.URI)));
        return (JSON.parse(urlImg) as string[]).map(image => new Page(this, chapter, new URL(image)));
    }
}