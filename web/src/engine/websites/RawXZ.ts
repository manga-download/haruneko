import { Tags } from '../Tags';
import icon from './RawXZ.webp';
import { type Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function CleanTitle(title: string): string {
    return title.replace(/\(Raw.*Free\)/i, '').trim();
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\//, 'div.breadcrumb span.current', (element, uri) => ({
    id: uri.pathname,
    title: CleanTitle(element.textContent)
}))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.manga-card-thumb', Common.PatternLinkGenerator('/manga/page/{page}/'), 0, anchor => ({
    id: anchor.pathname,
    title: CleanTitle(anchor.querySelector('.manga-card-title').textContent)
}))
@Common.ChaptersSinglePageCSS('div#chapter-list div.md-chapter-name a', undefined, Common.AnchorInfoExtractor(false, 'span'))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor () {
        super('rawxz', 'RawZO', 'https://rawzo.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pages = await Common.FetchPagesSinglePageCSS.call(this, chapter, 'div#reader-pages img');
        return pages.filter(page => {
            const realLink = page.Link.href.includes('img-proxy.php?url') ? decodeURIComponent(page.Link.searchParams.get('url')) : page.Link.href;
            page.Link.href = realLink;
            return !/\/wp-content\//.test(realLink);
        });
    }
}