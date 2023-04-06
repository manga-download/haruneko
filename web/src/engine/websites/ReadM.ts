import { Tags } from '../Tags';
import icon from './ReadM.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function MangaInfosExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('h2').textContent.trim();
    return { id, title };
}

function ChapterInfoExtractor(element: HTMLElement) {
    const id = element.querySelector<HTMLAnchorElement>('#table-episodes-title > h6 > a').pathname;
    const title = element.querySelector<HTMLTableCellElement>('#table-episodes-title').innerText.trim();
    return { id, title };

}
@Common.MangaCSS(/^https?:\/\/readm\.org\/manga\//, 'h1.page-title')
@Common.ChaptersSinglePageCSS('.episodes-list .item', ChapterInfoExtractor)
@Common.PagesSinglePageCSS('div.ch-images img.img-responsive')
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readm', `Read M`, 'https://readm.org', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const paths = [''].concat('abcdefghijklmnopqrstuvwxyz'.split(''));
        for (const path of paths) {
            mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, '/manga-list/' + path, '.poster a', MangaInfosExtractor));
        }
        return mangalist;
    }

}