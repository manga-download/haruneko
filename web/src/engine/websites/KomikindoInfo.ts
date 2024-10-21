import { Tags } from '../Tags';
import icon from './KomikindoInfo.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as ZManga from './templates/ZManga';
import { AddAntiScrapingDetection, FetchRedirection } from '../platform/AntiScrapingDetection';

AddAntiScrapingDetection(async (invoke) => {
    if(await invoke<boolean>(`window.SafeLineChallenge ? true : false`)) {
        if(await invoke<boolean>(`document.querySelector('button#sl-check') ? true : false`)) {
            return FetchRedirection.Interactive;
        } else {
            return FetchRedirection.Automatic;
        }
    }
    return undefined;
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