import { Tags } from '../Tags';
import icon from './Zhuzhumh.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapter = {
    chaptername: string,
    chapterurl: string
}

@Common.MangaCSS(/^{origin}\/book\/[^/]+\.html$/, 'div.cy_title h1')
@Common.MangasMultiPageCSS('/sort/1-{page}.html', 'div.cy_list_mh ul li.title a')
@Common.PagesSinglePageJS('newImgs', 1500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zhuzhumh', `Zhuzhumh`, 'https://www.zhuzhumh.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'ul#mh-chapter-list-ol-0 li a');
        const mangaid = manga.Identifier.match(/\/book\/([^.]+)\.html$/)[1];
        const data = await FetchJSON<APIChapter[]>(new Request(new URL(`/api/bookchapter?id=${mangaid}&id2=1`, this.URI)));
        chapterslist.push(...data.map(chapter => new Chapter(this, manga, new URL(chapter.chapterurl).pathname, chapter.chaptername.trim())));
        return chapterslist;
    }

}