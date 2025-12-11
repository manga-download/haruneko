import { Tags } from '../Tags';
import icon from './NicoManga.webp';
import { FetchWindowScript } from '../platform/FetchProvider';
import { DecoratableMangaScraper, type Manga} from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

function CleanMangaTitle(title: string): string {
    return title.replace(/\(Manga\)/i, '').replace(/- RAW/i, '').trim();
}

function ChapterLinkResolver(this: DecoratableMangaScraper, manga: Manga) {
    return new URL(`/app/manga/controllers/cont.Listchapter.php?slug=${FlatManga.ExtractSlug(manga)}`, this.URI);
}

@Common.MangaCSS<HTMLSpanElement>(/^{origin}\/manga-[^/]+\.html$/, 'div.breadcrumb-navigation span:last-of-type', (span, uri) => ({ id: uri.pathname, title: CleanMangaTitle(span.innerText) }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('a.manga-title', Common.PatternLinkGenerator('/manga-post.html?page={page}'), 0, anchor => ({ id: anchor.pathname, title: CleanMangaTitle(anchor.text) }))
@Common.ChaptersSinglePageCSS('ul.list-chapters a', ChapterLinkResolver, Common.AnchorInfoExtractor(true))
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
        return FetchWindowScript(new Request(this.URI), () => window.cookieStore.set('unlock_chapter_guest', '1'));
    }
}