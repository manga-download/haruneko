import { Tags } from '../Tags';
import icon from './OneTwoThreeHon.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.pathname.match(/[^/]+\/web-comic\/([^/]+)\//)[1];
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/web-comic\/[^/]+\/$/, 'div.title-area h2')
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onetwothreehon', `123hon`, 'https://www.123hon.com', Tags.Media.Manga, Tags.Language.Japanese );
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        for (const path of ['/polca/web-comic/', '/nova/web-comic']) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, path, 'ul.comic__list > li > a', MangaInfoExtractor);
            mangalist.push(...mangas);
        }
        return mangalist;

    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new Request(new URL(manga.Identifier, this.URI).href);
        const data = await FetchCSS(request, 'div.read-episode li');
        return data.map(element => {
            if (element.querySelector('a')) { // otherwise chapter not available
                return new Chapter(this, manga, new URL(element.querySelector('a').pathname.replace(/index.html$/, ''), this.URI).pathname, element.innerText.match(/\s*(.*?)\s+/)[1]);
            }
        }).filter(element => element !== undefined).filter(element => element.Identifier != '/');
    }
}