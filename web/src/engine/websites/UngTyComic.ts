import { Tags } from '../Tags';
import icon from './UngTyComic.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/[^.]+\.html$/, 'div.comics-detail-head h1.title-heading')
@Common.MangasMultiPageCSS('/truyen-tranh?page={page}', 'h4.content-title a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ungtycomic', 'Ung Ty Comic', 'https://ungtycomicsvip.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList: Chapter[] = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.searchParams.set('page', page.toString());
        const data = await FetchCSS<HTMLAnchorElement>(new Request(url), 'div.list-comics-chapter div.episode-title a');
        return data.map(chapter => new Chapter(this, manga, chapter.pathname, chapter.text.trim()));
    }
}