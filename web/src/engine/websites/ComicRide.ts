import { Tags } from '../Tags';
import icon from './ComicRide.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';

function MangaExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('a.p-update-list__main').pathname.replace(/\/\//g, "/"),
        title: element.querySelector('.p-update-list__title').textContent.trim()
    };
}

function ChapterExtractor(element: HTMLElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('span.p-backnumber-d__view a.u-over-opacity-img').pathname.replace(/\/\//g, "/"),
        title: element.querySelector('.p-backnumber-d .p-backnumber-d__title').textContent.trim()
    };
}

@Common.MangasSinglePageCSS('/', 'ul li.p-update-list__item', MangaExtractor)
@Common.ChaptersSinglePageCSS('article.p-modal-org', ChapterExtractor)
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicride', `ComicRide`, 'https://www.comicride.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https?:\/\/www\.comicride\.jp\/(\/)?book\/\S+\/(index\.html)?$/.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        return await Common.FetchMangaCSS.call(this, provider, url.replace(/\/\//g, "/"), '.p-detail-head__title');

    }

}