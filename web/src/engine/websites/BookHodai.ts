import { Tags } from '../Tags';
import icon from './BookHodai.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
function MangaLabelExtractor(element: HTMLElement): string {
    return element.textContent.split('＞').pop().trim() || element.textContent.trim();
}

@Common.MangaCSS(/^{origin}\/[^/]+\/backnumber\/\d+$/, 'section.breadcrumb div.bread-text', MangaLabelExtractor)
@SpeedBinb.PagesSinglePageAjax(true)
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
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, `/search/${path}?page={page}`, 'p.book-detail-pc__title a');
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        const [data] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'div.content');

        //get current "chapter" (book) title
        let title = data.querySelector('h2').textContent.trim();
        title = title.replace(manga.Title, '').trim() != '' ? title.replace(manga.Title, '').trim() : title;

        const chaptersNodes = [...data.querySelectorAll<HTMLElement>('.bookdetail_box div.pc a[href*="viewer"], div.matome-text-box')];
        const firstChapter = chaptersNodes.shift() as HTMLAnchorElement;
        chapters.push(new Chapter(this, manga, firstChapter.pathname + firstChapter.search, title));

        for (const chapter of chaptersNodes) {
            const title = chapter.querySelector('.matome_book_nm').textContent.trim();
            const link = chapter.querySelector<HTMLAnchorElement>('a[href*="viewer"]');
            chapters.push(new Chapter(this, manga, link.pathname + link.search, title.replace(manga.Title, '')));
        }
        return chapters.distinct();
    }
}