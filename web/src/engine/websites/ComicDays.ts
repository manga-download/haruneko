import { Tags } from '../Tags';
import icon from './ComicDays.webp';
import { type Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector<HTMLHeadingElement>('div.yomikiri-link-title h4').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/(episode|magazine|volume)\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicdays', `コミックDAYS (Comic Days)`, 'https://comic-days.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const series = await this.GetMangaListFromPages(provider, '/series', 'section.daily ul.daily-series > li.daily-series-item a.link[href*="/episode/"]', 'img');
        const magazines = await this.GetMangaListFromPages(provider, '/magazine', 'a.barayomi-magazine-list-link-latest', 'img.barayomi-magazine-series-image');
        const mangas = await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/oneshot', '/newcomer', '/daysneo' ], 'div.yomikiri-container ul.yomikiri-items > li.yomikiri-item-box > a.yomikiri-link', MangaExtractor);
        const mangaList = [...series, ...magazines, ...mangas];
        // remove mangas with same title but different ID
        return mangaList.filter(manga => manga === mangaList.find(m => m.Title === manga.Title));
    }
    private async GetMangaListFromPages(provider: MangaPlugin, path: string, query: string, queryimg: string): Promise<Manga[]> {
        const data = await FetchCSS<HTMLAnchorElement>(new Request(new URL(path, this.URI)), query);
        return data.map(element => new Manga(this, provider, element.pathname, element.querySelector(queryimg).getAttribute('alt').trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/^\/magazine\/\d+$/.test(manga.Identifier)) {
            return CoreView.FetchChaptersMultiPagesAJAXV1.call(this, manga);
        } else {
            return CoreView.FetchChaptersMultiPagesAJAXV2.call(this, manga);
        }
    }
}
