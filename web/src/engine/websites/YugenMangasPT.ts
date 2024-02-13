import { Tags } from '../Tags';
import icon from './YugenMangasPT.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIPages = {
    chapter_images: string[]
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('.chapter-title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.sinopse div.title-name h1')
@Common.MangasMultiPageCSS('/series?page={page}', 'div.gallery a.mangas-gallery')
@Common.ChaptersSinglePageCSS('div#listadecapitulos div.chapter a', ChapterExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    private readonly mediaUrl = 'https://media.yugenmangas.org/';

    public constructor() {
        super('yugenmangas-pt', 'YugenMangas (PT)', 'https://yugenmangas.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //chapter url is /series/mangaslug/chapterslug
        //apiUrl is /api/serie/mangaslug/chapter/chapterslug/images/imgs

        const matches = chapter.Identifier.match(/\/series\/([^/]+)\/([^/]+)\//);
        const apiUrl = new URL(`/api/serie/${matches[1]}/chapter/${matches[2]}/images/imgs`, this.URI).href;
        const request = new Request(new URL(apiUrl, this.URI).href);
        const pages = await FetchJSON<APIPages>(request);
        return pages.chapter_images.map(page => new Page(this, chapter, new URL(page, this.mediaUrl)));

    }
}