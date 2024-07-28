import { Tags } from '../Tags';
import icon from './ComicDays.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchCSS } from '../platform/FetchProvider';

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersSinglePageCSS()
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
        const series = await this.GetMangaListFromPages(provider, '/series', 'section.daily ul.daily-series > li.daily-series-item a.link', 'img');
        const magazines = await this.GetMangaListFromPages(provider, '/magazine', 'a.barayomi-magazine-list-link-latest', 'img.barayomi-magazine-series-image');
        const mangas = await CoreView.FetchMangasMultiPageCSS.call(this, provider, ['/oneshot', '/newcomer', '/daysneo'], 'div.yomikiri-container ul.yomikiri-items > li.yomikiri-item-box > a.yomikiri-link', undefined, 'div.yomikiri-link-title h4');
        const mangaList = [...series, ...magazines, ...mangas];
        // remove mangas with same title but different ID
        return mangaList.filter(manga => manga === mangaList.find(m => m.Title === manga.Title));
    }
    private async GetMangaListFromPages(provider: MangaPlugin, path: string, query: string, queryimg: string): Promise<Manga[]> {
        const request = new Request(new URL(path, this.URI).href);
        const data = await FetchCSS<HTMLAnchorElement>(request, query);
        return data.map(element => new Manga(this, provider, element.pathname, element.querySelector(queryimg).getAttribute('alt').trim()));
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        if (/^\/magazine\/\d+$/.test(manga.Identifier)) {
            const [data] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), '.episode-header-title');
            return [new Chapter(this, manga, manga.Identifier, data.textContent.replace(manga.Title, '').trim())];
        } else {
            return CoreView.FetchChaptersSinglePageCSS.call(this, manga);
        }
    }
}
