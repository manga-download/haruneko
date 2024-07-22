import { Tags } from '../Tags';
import icon from './WeLoMa.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as FlatManga from './decorators/FlatManga';
import { FetchWindowScript } from '../platform/FetchProvider';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (render) => {
    const dom = await render();
    return dom.documentElement.innerHTML.includes(`ct_anti_ddos_key`) ? FetchRedirection.Automatic : undefined;
});

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, FlatManga.queryMangaTitle, FlatManga.MangaLabelExtractor)
@Common.MangasMultiPageCSS(FlatManga.pathMultiPageManga, FlatManga.queryMangas, 1, 1, 0, FlatManga.MangaExtractor)
@FlatManga.ChaptersSinglePageCSS()
@Common.PagesSinglePageCSS(FlatManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('weloma', `WeLoMa`, 'https://weloma.art', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return await FetchWindowScript(new Request(new URL('/manga-list.html', this.URI)), 'true', 3000, 30000);//trigger antiDDOSS
    }
}