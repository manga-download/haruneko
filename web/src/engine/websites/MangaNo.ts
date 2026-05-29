import { Tags } from '../Tags';
import icon from './MangaNo.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import type { PageParams } from './decorators/CoreView';
import { FetchWindowScript } from '../platform/FetchProvider';

type JSONPages = {
    pages: {
        src: string;
        type: string;
    }[],
    choJuGiga?: string
};

@Common.MangaCSS(/^{origin}\/works\/[^/]+$/, 'section[class*="_workId__series_info"] > h2')
@Common.MangasSinglePageCSS('/new_works', 'a[class*="MangaItem_work_title_link"]')
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul li[class*="_workId__episode_container"] a', undefined, anchor => ({ id: anchor.pathname, title: anchor.querySelector('[class*="_workId__episode_title"]').textContent.trim() }))
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangano', 'マンガノ (MangaNo)', 'https://manga-no.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page<PageParams>[]> {
        const { pages, choJuGiga } = await FetchWindowScript<JSONPages>(new Request(new URL(chapter.Identifier, this.URI)), `JSON.parse( document.querySelector('giga-viewer[page-structure]')?.getAttribute('page-structure') ?? '{}')`, 1500);
        return !pages ? [] : pages.filter(({ type }) => type === 'main')
            .map(({ src }) => new Page(this, chapter, new URL(decodeURIComponent(new URL(src).pathname.match(/http.*/).at(0))), { scrambled: choJuGiga === 'baku' }));
    }

}