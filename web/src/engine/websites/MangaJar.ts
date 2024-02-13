import { Tags } from '../Tags';
import icon from './MangaJar.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('p.card-title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/manga\//, 'span.post-name')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.row article.flex-item div.post-description a.card-about', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('img.page-image')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangajar', `MangaJar`, 'https://mangajar.com', Tags.Language.English, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa,);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await this.getChaptersFromPage(page, manga);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;

    }

    private async getChaptersFromPage(page: number, manga: Manga): Promise<Chapter[]> {
        const url = new URL(manga.Identifier + '/chaptersList?page='+page, this.URI).href;
        const request = new Request(url);
        const data = await FetchCSS<HTMLAnchorElement>(request, 'ul.list-group li.chapter-item a');
        return data.map(anchor => new Chapter(this, manga, anchor.pathname, anchor.text.trim()));
    }
}
