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

@Common.MangaCSS(/^{origin}\/comic\/[^/]+/, '.comics-detail__title')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('a.comics-chapters__item', undefined, (anchor) => ({ id: anchor.pathname + anchor.search, title: anchor.text.trim() }))
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
        type This = typeof this;
        return Array.fromAsync(async function* (this: This) {
            for (let page = 1, run = true; run; page++) {
                const { items } = await FetchJSON<APIMangas>(new Request(new URL(`./amp_comic_list?type=all&region=all&filter=*&page=${page}&limit=200`, this.apiUrl)));
                const mangas = items.map(({ comic_id: id, name }) => new Manga(this, provider, `/comic/${id}`, name.trim()));
                mangas.length > 0 ? yield* mangas : run = false;
            }

        }.call(this));
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pagesList: Page[] = [];
        let chapterPageUri = new URL(chapter.Identifier, this.URI);
        const sectionSlot = chapterPageUri.searchParams.get('section_slot');
        const chapterSlot = chapterPageUri.searchParams.get('chapter_slot');
        for (let hasNextPage = true, pageIndex = 2; hasNextPage; pageIndex++) {
            const doc = await FetchHTML(new Request(chapterPageUri));
            const pages = [...doc.querySelectorAll<HTMLElement>('.comic-contain amp-img')]
                .map(element => new Page(this, chapter, new URL(this.ReplaceCDN(element.dataset.src))));
            pagesList.push(...pages);
            chapterPageUri = new URL([...doc.querySelectorAll<HTMLAnchorElement>('div.comic-chapter div.next_chapter a')].at(-1)?.pathname, this.URI);
            hasNextPage = new RegExpSafe(`/${sectionSlot}_${chapterSlot}_${pageIndex}\\.html?$`, 'i').test(chapterPageUri.href);
        }
        return pagesList;
    }

    private ReplaceCDN(pageUrl: string): string {
        return pageUrl.replace(/^https?:\/\/(?:[\ww-]+).baozicdn.com\/(.+)$/, 'https://static-tw.baozimh.com/$1');
    }
}
