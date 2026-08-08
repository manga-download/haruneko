import { Tags } from '../Tags';
import icon from './BookHodai.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

type APIChapters = {
    backnumber: {
        book_id: string;
        branch_no: string;
        book_type: string;
        book_title: string;
        flg_vol: '0' | '1';
        vol: string;
    }[],
    max_backnumber_page: number;
};

@Common.MangaCSS(/^{origin}\/[^/]+\/backnumber\/\d+$/, 'ol.c-breadcrumb li:last-of-type a, div.p-book-overview__detail h2.p-book-overview__detail-bookname', (element, uri) => ({
    id: uri.pathname,
    title: element.textContent.split('＞').pop().trim() || element.textContent.trim()
}))
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016130)
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
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, '.p-bookdetail-contents__title a', Common.PatternLinkGenerator(`/search/${path}?page={page}`));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const dom = await FetchHTML(new Request(new URL(manga.Identifier, this.URI)));
        let firstChapter: Chapter = undefined;

        //get first "chapter" (book) details
        const bookdetails = dom.querySelector<HTMLDivElement>('section.p-book-overview');
        const bookInfosElement = dom.querySelector<HTMLElement>('[data-book-id]');

        let title = (bookdetails.querySelector('span.p-book-overview__detail-volnumber') ?? bookdetails.querySelector('h2.p-book-overview__detail-vol')).textContent.replaceAll('\n', '').trim();
        title = title.replace(manga.Title, '').trim() != '' ? title.replace(manga.Title, '').trim() : title;
        const chapterlinkNode = bookdetails.querySelector<HTMLAnchorElement>('a.p-book-button[href*="viewer"]');
        if (chapterlinkNode) firstChapter = new Chapter(this, manga, chapterlinkNode.pathname + chapterlinkNode.search, title);

        type This = typeof this;
        const moreChapters: Chapter[] = await Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { backnumber, max_backnumber_page } = await FetchJSON<APIChapters>(new Request(new URL(`./book/ajax_backnumber_series_page?book_id=${bookInfosElement.dataset.bookId}&member_id=0&book_type=${bookInfosElement.dataset.bookType}&page=${page}&matome=1`, this.URI), {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }));
                const chapters = backnumber.map(({ book_id: id, book_title: title, book_type: type, branch_no: number, flg_vol: flagVolume, vol }) => new Chapter(this, manga, `/viewer?book_id=${id}&branch_no=${number}&book_type=${type}`, flagVolume === '1' ? `${vol} 巻` : title));
                yield* chapters;
                run = max_backnumber_page > page;
            }
        }.call(this));
        return [firstChapter, ...moreChapters,].filter(el => el);
    }
}