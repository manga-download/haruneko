import { Tags } from '../Tags';
import icon from './ArabsHentai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchRegex } from '../platform/FetchProvider';
import { GetBytesFromBase64, GetUTF8FromBytes } from '../BufferEncoder';

type JSONPages = {
    url: string;
}[];

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.sheader div.data h1')
@Common.MangasMultiPageCSS('article div.data h3 a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('div#chapter-list ul li a:not(:has(span.chapter-lock))', undefined, anchor => ({
    id: anchor.pathname,
    title: anchor.querySelector<HTMLSpanElement>('span.chapternum').textContent.trim()
}))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('arabshentai', 'ArabsHentai', 'https://arabshentai.com', Tags.Media.Manhwa, Tags.Language.Arabic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const [json] = await FetchRegex(new Request(new URL(chapter.Identifier, this.URI)), /const\s*images\s*=\s*(\[.*\])/g);
        return (<JSONPages>JSON.parse(json)).map(({ url }) => new Page(this, chapter, new URL(GetUTF8FromBytes(GetBytesFromBase64(url))), { Referer: this.URI.href }));
    }
}