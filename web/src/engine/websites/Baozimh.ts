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
        super('baozimh', `包子漫書 (baozimh)`, 'https://www.baozimh.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
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
        const pagesList: Page[] = [];
        let uri = new URL(chapter.Identifier, this.URI);
        const sectionSlot = uri.searchParams.get('section_slot');
        const chapterSlot = uri.searchParams.get('chapter_slot');
        for (let run = true, pageIndex = 2; run; pageIndex++) {
            const doc = await FetchHTML(new Request(uri));
            const pages = [...doc.querySelectorAll<HTMLElement>('.comic-contain amp-img')];
            pagesList.push(...pages.map(element => new Page(this, chapter, new URL(this.ReplaceCDN(element.dataset.src)))));
            uri = new URL([...doc.querySelectorAll<HTMLAnchorElement>('div.comic-chapter div.next_chapter a')].at(-1)?.pathname, this.URI);
            run = new RegExpSafe(`/${sectionSlot}_${chapterSlot}_${pageIndex}\\.html?$`, 'i').test(uri.href);
        }
        return pagesList;
    }

    private ReplaceCDN(pageUrl: string): string {
        return pageUrl.replace(/^https?:\/\/(?:[\ww-]+).baozicdn.com\/(.+)$/, 'https://static-tw.baozimh.com/$1');
    }
}
