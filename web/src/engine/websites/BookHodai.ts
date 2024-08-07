import { Tags } from '../Tags';
import icon from './BookHodai.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchHTML } from '../platform/FetchProvider';
function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.split('＞').pop().trim() || element.textContent.trim();
}

@Common.MangaCSS(/^{origin}\/[^/]+\/backnumber\/\d+$/, 'section.breadcrumb div.bread-text', MangaLabelExtractor)
@SpeedBinb.PagesSinglePageAjaxv016130()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('bookhodai', `BookHodai`, 'https://bookhodai.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const paths = ['magazine', 'magazine_pop', 'manga', 'manga_pop'];
        const mangaList: Manga[] = [];
        for (const path of paths) {
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/search/${path}?page={page}`, '.p-bookdetail-contents__title a');
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        const dom = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));

        //get first "chapter" (book) details
        const bookdetails = dom.querySelector<HTMLDivElement>('section.p-book-overview');
        let title = bookdetails.querySelector('.p-book-overview__detail-volnumber').textContent.trim();
        title = title.replace(manga.Title, '').trim() != '' ? title.replace(manga.Title, '').trim() : title;
        const chapterlinkNode = bookdetails.querySelector<HTMLAnchorElement>('a[href*="viewer"');
        chapters.push(new Chapter(this, manga, chapterlinkNode.pathname + chapterlinkNode.search, title));

        const chaptersNodes = [...dom.querySelectorAll<HTMLElement>('div.p-book-backnumber-series__item')];
        for (const chapter of chaptersNodes) {
            const title = chapter.querySelector('.p-book-backnumber-series__volnumber').textContent.trim();
            const link = chapter.querySelector<HTMLAnchorElement>('a[href*="viewer"]');
            chapters.push(new Chapter(this, manga, link.pathname + link.search, title.replace(manga.Title, '')));
        }
        return chapters.distinct();
    }
}