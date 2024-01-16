import { Tags } from '../Tags';
import icon from './CarToonMad.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^https?:\/\/(www\.)?cartoonmad\.com\/[^/]+/, 'td:nth-child(2)  tr:nth-child(3) > td:nth-child(2) > a:last-child')
@Common.MangasMultiPageCSS('/comic99.0{page}.html', 'a.a1')
@Common.ChaptersSinglePageCSS('#info td > a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('cartoonmad', `CarToonMad`, 'https://www.cartoonmad.com', Tags.Language.Chinese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const referer = new URL(chapter.Identifier, this.URI).href;
        const request = new Request(new URL(chapter.Identifier, this.URI.href.replace('.com', '.cc')).href, {
            headers: { 'referer': referer}
        });
        const data = await FetchCSS(request, 'body');
        const maxpage = parseInt(data[0].querySelector('a:nth-last-of-type(2).pages').textContent);
        const pageone = data[0].querySelector <HTMLImageElement>('a > img[oncontextmenu]').src;
        return [...new Array(maxpage).keys()].map(index => {
            return new Page(this, chapter, new URL(pageone.replace(/(\d+)$/, String(index + 1).padStart(3, '0')), this.URI), { 'Referer': referer });
        });
    }
}
