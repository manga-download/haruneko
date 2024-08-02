import { Tags } from '../Tags';
import icon from './ComicFesta.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, } from '../platform/FetchProvider';
import * as ClipStudioReader from './decorators/ClipStudioReader';

@Common.MangaCSS(/^{origin}\/titles\/\d+\/volumes$/, 'div#cts-title-wrap h2', Common.ElementLabelExtractor('span'))
@Common.MangasNotSupported()
@ClipStudioReader.PagesSinglePageAJAX()
@ClipStudioReader.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicfesta', 'コミックフェスタ | ComicFesta', 'https://comic.iowl.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterList = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.GetChaptersFromPage(manga, page);
            chapters.length > 0 ? chapterList.push(...chapters) : run = false;
        }
        return chapterList.distinct();
    }

    private async GetChaptersFromPage(manga: Manga, page: number): Promise<Chapter[]> {
        const url = new URL(manga.Identifier, this.URI);
        url.searchParams.set('page', page.toString());
        url.searchParams.set('paginate', 'true');
        const chapters = await FetchCSS(new Request(url), 'div.table-box');
        return chapters.map(chapter => new Chapter(this, manga, chapter.querySelector<HTMLAnchorElement>('ul.com-link li a').pathname, chapter.querySelector('th').textContent.trim()));
    }
}