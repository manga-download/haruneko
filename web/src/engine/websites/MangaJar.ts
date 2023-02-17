import { Tags } from '../Tags';
import icon from './MangaJar.webp';
import { type Chapter, DecoratableMangaScraper, type MangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('p.card-title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/mangajar\.com\/manga\//, 'span.post-name')
@Common.MangasMultiPageCSS('/manga?page={page}', 'div.row article.flex-item div.post-description a.card-about', 1, 1, 0, MangaInfoExtractor)
@Common.PagesSinglePageCSS('img.page-image')
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangajar', `MangaJar`, 'https://mangajar.com', Tags.Language.English, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa,);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(this : MangaScraper, manga: Manga): Promise<Chapter[]> {
        const chapterslist = [];
        for (let page = 1, run = true; run; page++) {
            const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'ul.list-group li.chapter-item a', Common.AnchorInfoExtractor(), manga.Identifier + '/chaptersList?page=' + page);
            chapters.length > 0 ? chapterslist.push(...chapters) : run = false;
        }
        return chapterslist;

    }
}
