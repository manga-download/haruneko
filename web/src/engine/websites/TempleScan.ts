import { Tags } from '../Tags';
import icon from './TempleScan.webp';
import { FetchNextJS } from '../platform/FetchProvider';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

type PagesData = {
    chapterName: string;
    layoutHints: any[];
};

@Common.MangaCSS<HTMLMetaElement>(/^{origin}\/comic\/[^/]+$/, 'head meta[property="og:title"]')
@Common.MangasMultiPageCSS('div.grid div.w-full > a:has(h2)', Common.PatternLinkGenerator('/comics?page={page}'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('ul#chapter-list li a', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector('span.truncate').textContent.trim()
}))

@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    private readonly apiURL = 'https://api.templetoons.com/api/';

    public constructor() {
        super('templescan', 'TempleScan', 'https://templetoons.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //they use seeded (random) property names for pages
        const pagesData = await FetchNextJS<PagesData>(new Request(new URL(chapter.Identifier, this.URI)), data => 'chapterName' in data && 'layoutHints' in data);
        const pageNumbers = pagesData.layoutHints?.length;
        return (Object.values(pagesData).find(value => Array.isArray(value) && value.length === pageNumbers && value[0].startsWith('http')) as string[]).map(image =>
            new Page(this, chapter, new URL(image, this.URI))
        );
    }
}