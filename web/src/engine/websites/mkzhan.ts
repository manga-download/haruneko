import { Tags } from '../Tags';
import icon from './mkzhan.webp';
import { Chapter, DecoratableMangaScraper, type Manga, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult<T> = {
    code: number,
    data: T
}
type APIChapter = {
    chapter_id: number,
    title : string
}
type APIPages = {
    page: {
        image : string
    }[]
}

@Common.MangaCSS(/^{origin}\/\d+\/$/, 'div.de-info__box p.comic-title')
@Common.MangasMultiPageCSS('/category/?page={page}', 'div.cate-comic-list div.common-comic-item a.cover')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://comic.mkzcdn.com';

    public constructor() {
        super('mkzhan', `mkzhan`, 'https://www.mkzhan.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Source.Aggregator);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga) : Promise<Chapter[]>{
        const mangaId = manga.Identifier.match(/\/(\d+)\/$/)[1];
        const request = new Request(new URL(`/chapter/v1/?comic_id=${mangaId}`, this.apiUrl).href);
        const data = await FetchJSON<APIResult<APIChapter[]>>(request);
        return data.code == 200 ? data.data.map(element => new Chapter(this, manga, String(element.chapter_id), element.title.trim())) : [];
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const mangaId = chapter.Parent.Identifier.match(/\/(\d+)\/$/)[1];
        const request = new Request(new URL(`/chapter/content/v1/?chapter_id=${chapter.Identifier}&comic_id=${mangaId}&format=1&quality=1&type=1`, this.apiUrl).href);
        const data = await FetchJSON<APIResult<APIPages>>(request);
        return data.code == 200 ? data.data.page.map(element => new Page(this, chapter, new URL(element.image))) : [];
    }
}