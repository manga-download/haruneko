import { Tags } from '../Tags';
import icon from './ZinMangaNet.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type MangaID = {
    post: string,
    slug: string
};

type APIChapters = {
    chapters: APIChapter[]
}

type APIChapter = {
    name: string,
    url: string
}

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS()
@Madara.PagesSinglePageCSS('div.page-break img.wp-manga-chapter-img')
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zinmanganet', 'ZinManga(.net)', 'https://www.zinmanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const { post } = JSON.parse(manga.Identifier) as MangaID;
        const { chapters } = await FetchJSON<APIChapters>(new Request(new URL(`Comic/Services/ComicService.asmx/ProcessChapterList?comicId=${post}`, this.URI)));
        return chapters.map(chapter => new Chapter(this, manga, `/manga${chapter.url}`, chapter.name));
    }

}