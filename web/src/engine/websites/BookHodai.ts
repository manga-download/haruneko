import { Tags } from '../Tags';
import icon from './BookHodai.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchHTML } from '../platform/FetchProvider';
import { SBVersion } from './decorators/SpeedBinb';

function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.split('＞').pop().trim() || element.textContent.trim();
}

@Common.MangaCSS(/^{origin}\/[^/]+\/backnumber\/\d+$/, 'ol.c-breadcrumb li:last-of-type a, div.p-book-overview__detail h2.p-book-overview__detail-bookname', MangaLabelExtractor)
@SpeedBinb.PagesSinglePageAjax(SBVersion.v016130)
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
        let title = (bookdetails.querySelector('span.p-book-overview__detail-volnumber') ?? bookdetails.querySelector('h2.p-book-overview__detail-vol')).textContent.replaceAll('\n', '').trim();
        title = title.replace(manga.Title, '').trim() != '' ? title.replace(manga.Title, '').trim() : title;
        const chapterlinkNode = bookdetails.querySelector<HTMLAnchorElement>('a[href*="viewer"');
        if (chapterlinkNode) chapters.push(new Chapter(this, manga, chapterlinkNode.pathname + chapterlinkNode.search, title));

        const chaptersNodes = [...dom.querySelectorAll<HTMLElement>('div.p-book-backnumber-series__item')];
        for (const chapter of chaptersNodes) {
            const title = (chapter.querySelector('.p-book-backnumber-series__volnumber') ?? chapter.querySelector('.p-book-backnumber-series__book-nm')).textContent.trim();
            const link = chapter.querySelector<HTMLAnchorElement>('a[href*="viewer"]');
            chapters.push(new Chapter(this, manga, link.pathname + link.search, title.replace(manga.Title, '').trim()));
        }
        return chapters.distinct();
    }
}