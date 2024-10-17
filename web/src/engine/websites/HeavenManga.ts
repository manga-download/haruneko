import { Tags } from '../Tags';
import icon from './HeavenManga.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

function MangaInfoExtractor(element: HTMLAnchorElement) {
    return {
        id: element.pathname,
        title: element.querySelector('img').alt.trim()
    };
}

type APIChapter = {
    data: {
        slug: string
        id : number
    }[]
}

const scriptPages = `window.pUrl.map(page => page.imgURL);`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.site-content div.post-title h3')
@Common.MangasMultiPageCSS('/top?page={page}', 'div.page-item-detail div.photo a.thumbnail', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageJS(scriptPages, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('heavenmanga', `HeavenManga`, 'https://heavenmanga.com', Tags.Language.Spanish, Tags.Source.Aggregator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const { data } = await FetchJSON<APIChapter>(request);
        return data.map(page => new Chapter(this, manga, `/manga/leer/${page.id}`, `Chapter ${page.slug}`));
    }
}