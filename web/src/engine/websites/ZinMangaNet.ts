import { Tags } from '../Tags';
import icon from './ZinMangaNet.webp';
import { Chapter, DecoratableMangaScraper, Page, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchJSON } from '../platform/FetchProvider';

type APIChapters = {
    data: {
        chapters: {
            chapter_name: string;
            chapter_slug: string;
        }[]
    }
};

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS()
@Common.ImageAjax(true, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zinmanganet', 'ZinManga(.net)', 'https://www.zinmanga.net', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist: Array<Chapter> = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(page, manga);
            chapterslist.isMissingLastItemFrom(chapters) ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;
    }

    private async GetChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const slug = (JSON.parse(manga.Identifier) as { slug: string }).slug.split('/').at(-1);
        const { data: {chapters } } = await FetchJSON<APIChapters>(new Request(new URL(`./api/comics/${slug}/chapters?page=${page}&per_page=100&order=desc`, this.URI)));
        return chapters.map(({ chapter_slug: chapterSlug, chapter_name: chapterName }) => new Chapter(this, manga, `/manga/${slug}/${chapterSlug}`, chapterName));

    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Madara.FetchPagesSinglePageCSS.call(this, chapter, 'div.page-break img.wp-manga-chapter-img');
        return pages.map(page => new Page(this, chapter, page.Link, { Referer: this.URI.href }));
    }
}