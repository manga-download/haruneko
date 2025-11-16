import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import { Tags } from '../Tags';
import icon from './ComicDays.webp';
import * as Common from './decorators/Common';
import * as CoreView from './decorators/CoreView';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const titleElement = anchor.querySelector<HTMLHeadingElement>('div.yomikiri-link-title h4');
    return {
        id: anchor.pathname,
        title: titleElement ? titleElement.textContent.trim() : anchor.querySelector<HTMLImageElement>('img.barayomi-magazine-series-image, img').alt.trim()
    };
}

@Common.MangaCSS(/^{origin}\/(episode|magazine|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersMultiPageAJAXV2('magazine', 'volume', 'episode')
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
            Common.FetchMangasSinglePageCSS.call(this, provider, '/magazine', 'a.barayomi-magazine-list-link-latest', MangaExtractor),
            Common.FetchMangasSinglePageCSS.call(this, provider, '/series', 'section.daily ul.daily-series > li.daily-series-item a.link[href*="/episode/"]', MangaExtractor),
            Common.FetchMangasMultiPageCSS.call(this, provider, 'div.yomikiri-container ul.yomikiri-items > li.yomikiri-item-box > a.yomikiri-link', Common.StaticLinkGenerator('/oneshot', '/newcomer', '/daysneo'), 0, MangaExtractor),
        ])).flat();
        // remove mangas with same title but different ID
        return mangas.filter(manga => manga === mangas.find(m => m.Title === manga.Title));
    }
}