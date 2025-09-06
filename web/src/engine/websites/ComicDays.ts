import { Tags } from '../Tags';
import icon from './ComicDays.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const titleElement = anchor.querySelector<HTMLHeadingElement>('div.yomikiri-link-title h4');
    return {
        id: anchor.pathname,
        title: titleElement ? titleElement.textContent.trim() : anchor.querySelector<HTMLImageElement>('img.barayomi-magazine-series-image, img').alt.trim()
    };
}

@Common.MangaCSS(/^{origin}\/(episode|magazine|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersMultiPageAJAXV2(['episode', 'volume', 'magazine'])
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicdays', 'コミックDAYS (Comic Days)', 'https://comic-days.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangas = (await Promise.all([
            Common.FetchMangasSinglePagesCSS.call(this, provider, ['/series'], 'section.daily ul.daily-series > li.daily-series-item a.link[href*="/episode/"]', MangaExtractor),
            Common.FetchMangasSinglePagesCSS.call(this, provider, ['/magazine'], 'a.barayomi-magazine-list-link-latest', MangaExtractor),
            Common.FetchMangasSinglePagesCSS.call(this, provider, ['/oneshot', '/newcomer', '/daysneo'], 'div.yomikiri-container ul.yomikiri-items > li.yomikiri-item-box > a.yomikiri-link', MangaExtractor),
        ])).flat();
        // remove mangas with same title but different ID
        return mangas.filter(manga => manga === mangas.find(m => m.Title === manga.Title));
    }
}