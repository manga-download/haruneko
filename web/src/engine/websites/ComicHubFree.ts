import { Tags } from '../Tags';
import icon from './ComicHubFree.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/comic\/[^/]+$/, 'ol.breadcrumb li:last-of-type')
@Common.ChaptersMultiPageCSS<HTMLAnchorElement>('div.episode-list tr td a', Common.PatternLinkGenerator('{id}?page={page}'), 0, anchor => ({
    id: anchor.pathname + '/all',
    title: anchor.textContent.trim()
}))
@Common.PagesSinglePageCSS('div.chapter-container img.chapter_img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mycomiclist', 'ComicHub Free', 'https://comichubfree.com', Tags.Language.English, Tags.Media.Comic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist: Manga[] = [];
        const paths = '0abcdefghijklmnopqrstuvwxyz'.split('');
        for (const letter of paths) {
            mangalist.push(... await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.serie-box ul li a', Common.PatternLinkGenerator(`/comic-list/?c=${letter}&page={page}`)));
        }
        return mangalist.distinct();
    }
}