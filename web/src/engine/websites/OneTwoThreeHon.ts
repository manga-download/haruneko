import { Tags } from '../Tags';
import icon from './OneTwoThreeHon.webp';
import { Chapter, DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
import { SBVersion } from './decorators/SpeedBinb';

function MangaInfoExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.pathname.match(/[^/]+\/web-comic\/([^/]+)\//)[1]
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/web-comic\/[^/]+\/$/, 'div.title-area h2')
@SpeedBinb.PagesSinglePageAjax(SBVersion.v016061)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('onetwothreehon', `123hon`, 'https://www.123hon.com', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        //do nothing, as https://www.123hon.com fails to load but https://www.123hon.com/nova and https://www.123hon.com/polca works
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
        const data = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'div.read-episode li');
        const chapterlist: Chapter[] = data.map(element => {
            if (element.querySelector('a')) { // otherwise chapter not available
                return new Chapter(this, manga, new URL(element.querySelector('a').pathname.replace(/index.html$/, ''), this.URI).pathname, element.innerText.match(/\s*(.*?)\s+/)[1]);
            }
        });
        return chapterlist.distinct();
    }
}