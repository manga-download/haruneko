import { Tags } from '../Tags';
import icon from './ShonenMagazine.webp';
import { DecoratableMangaScraper, type MangaPlugin, type Manga } from '../providers/MangaPlugin';
import * as CoreView from './decorators/CoreView';
import * as Common from './decorators/Common';

function MangaExtractor(element: HTMLLIElement) {
    return {
        id: element.querySelector<HTMLAnchorElement>('div.button a[href*="/episode/"]').pathname,
        title: element.querySelector<HTMLDivElement>('div.title').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/episode\/\d+$/, CoreView.queryMangaTitleFromURI)
@CoreView.ChaptersSinglePageAJAXV1()
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
        const mangas1 = await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/series' ], 'div.series-items ul.daily-series > li.daily-series-item > a', CoreView.DefaultMangaExtractor);
        let mangas2 = [];
        try {
            // TODO: Do not change a read-only property, this may cause problems for concurrent operations!
            this.URI.hostname = 'shonenmagazine.com';
            mangas2 = await Common.FetchMangasSinglePagesCSS.call(this, provider, [ '/series/smaga', '/series/bmaga', '/series/mpoke' ], 'li.has-buttons:has(a[href*="/episode/"])', MangaExtractor);
        } catch { /* TODO: Only suppress expected errors, but not generic errors such as out of memory */ }
        // TODO: Do not change a read-only property, this may cause problems for concurrent operations!
        this.URI.hostname = 'pocket.shonenmagazine.com';
        return [...mangas1, ...mangas2];
    }
}