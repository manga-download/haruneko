import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

function CleanMangaTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').replace(/- RAW/i, '').trim();
}

@Common.MangaCSS<HTMLSpanElement>(/^{origin}\/manga-[^/]+\.html$/, 'div.breadcrumb-navigation span:last-of-type', (span, uri) => ({ id: uri.pathname, title: CleanMangaTitle(span.innerText) }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.manga-title', Common.PatternLinkGenerator('/manga-post.html?page={page}'), 0, anchor => ({ id: anchor.pathname, title: CleanMangaTitle(anchor.text) }))
@Common.PagesSinglePageJS(`[...document.querySelectorAll('div.chapter-image-wrapper img')].map(image => image.dataset.src?.trim() ?? image.src);`)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nicomanga', 'NicoManga', 'https://nicomanga.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), () => {
            window.cookieStore.set('unlock_chapter_guest', '1');
        });
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const slug = FlatManga.ExtractSlug(manga);
        return Common.FetchChaptersSinglePageCSS.call(this, manga, 'ul.list-chapters a', `/app/manga/controllers/cont.Listchapter.php?slug=${slug}`, Common.AnchorInfoExtractor(true));
    }

}
