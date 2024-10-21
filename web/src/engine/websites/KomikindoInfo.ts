import { Tags } from '../Tags';
import icon from './KomikindoInfo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    const result = await invoke<boolean>(`window.SafeLineChallenge ? true : false`);
    return result ? FetchRedirection.Interactive : undefined;
});

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, ZManga.queryMangaTitle)
@Common.MangasSinglePageCSS(ZManga.queryMangaPath, ZManga.queryManga)
@Common.ChaptersSinglePageCSS(ZManga.queryChapters, Common.AnchorInfoExtractor(false, 'span.date'))
@Common.PagesSinglePageCSS(ZManga.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('komikindoinfo', 'KomikindoInfo', 'https://komikindo.info', Tags.Media.Manga, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}