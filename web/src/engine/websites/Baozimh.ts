import { Tags } from '../Tags';
import icon from './Baozimh.webp';
import { type Chapter, DecoratableMangaScraper, Page, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    items: {
        comic_id: string,
        name: string
    }[]
}
function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+/, '.comics-detail__title')
@Common.ChaptersSinglePageCSS('a.comics-chapters__item', ChapterInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    private readonly apiUrl = 'https://www.baozimh.com/api/bzmhq/';

    public constructor() {
        super('baozimh', `包子漫書 (baozimh)`, 'https://www.baozimh.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList = [];
        for (let page = 1, run = true; run; page++) {
            const mangas = await this.GetMangasFromPage(page, provider);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }
    private async GetMangasFromPage(page: number, provider: MangaPlugin): Promise<Manga[]> {
        const { items } = await FetchJSON<APIMangas>(new Request(new URL(`amp_comic_list?type=all&region=all&filter=*&page=${page}&limit=200`, this.apiUrl)));
        return items.map(item => new Manga(this, provider, `/comic/${item.comic_id}`, item.name.trim()));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagesList : Page[] = [];
        let uri = new URL(chapter.Identifier, this.URI);
        const sectionSlot = uri.searchParams.get('section_slot');
        const chapterSlot = uri.searchParams.get('chapter_slot');
        const linkRegex = new RegExp(`/${sectionSlot}_${chapterSlot}_\\d+\\.html?$`, 'i');
        for (let run = true; run;) {
            const data = await FetchHTML(new Request(uri));
            const pages = [...data.querySelectorAll('.comic-contain amp-img.comic-contain__item')];
            pagesList.push(...pages.map(element => new Page(this, chapter, new URL(element.getAttribute('src'), this.URI))));
            uri = new URL([...data.querySelectorAll<HTMLAnchorElement>('div.comic-chapter div.next_chapter a')].pop()?.pathname, this.URI);
            run = linkRegex.test(uri.href);
        }
        return pagesList;
    }
}