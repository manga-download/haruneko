import { Tags } from '../Tags';
import icon from './ShonenMagazine.webp';
import { DecoratableMangaScraper, type MangaPlugin, Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';
import { FetchCSS, FetchRequest } from '../FetchProvider';

@Common.MangaCSS(/^https?:\/\/pocket\.shonenmagazine\.com\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersSinglePageCSS(CoreView.queryChapters)
@CoreView.PagesSinglePageJSON()
@CoreView.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        //Shonenmagazine.com && pocket.shonenmagazine.com mangas url starts with https://pocket.shonenmagazine.com so this plugin handles both.
        super('shonenmagazine', `週刊少年マガジ (Weekly Shonen Magazine & Pocket Magazine)`, 'https://pocket.shonenmagazine.com', Tags.Language.Japanese, Tags.Source.Official, Tags.Media.Manga);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {

        //fetch from pocket.shonenmagazine.com [/series]
        const mangas = await CoreView.FetchMangasMultiPageCSS.call(this, provider, ['/series'], 'div.series-items ul.daily-series > li.daily-series-item > a');

        //fetch from shonenmagazine.com
        for (const path of ['/series/smaga', '/series/bmaga', '/series/others']) {
            const request = new FetchRequest(new URL(path, 'https://shonenmagazine.com').href);
            const data = await FetchCSS<HTMLAnchorElement>(request, 'article.serial-series-contents ul.serial-series-list > li.serial-series-item > a');
            for (const anchor of data) {
                const manga = new Manga(this, provider, anchor.pathname, anchor.querySelector(CoreView.queryMangaTitle).textContent.trim());
                mangas.push(manga);
            }
        }
        return mangas;
    }
}