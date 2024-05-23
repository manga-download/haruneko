import { Tags } from '../Tags';
import icon from './Baozimh.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchHTML } from '../platform/FetchProvider';

function ChapterInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname + anchor.search,
        title: anchor.text.trim()
    };
}

@Common.MangaCSS(/^{origin}\/comic\/[^/]+/, '.comics-detail__title')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageCSS('a.comics-chapters__item', ChapterInfoExtractor)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('baozimh', `包子漫書 (baozimh)`, 'https://www.baozimh.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Media.Manga, Tags.Media.Manhua, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
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
            run = uri && linkRegex.test(uri.href);
        }
        return pagesList.filter((page, index) => { //not sure if needed anymore
            return index === pagesList.findIndex(item => item === page);
        });
    }
}