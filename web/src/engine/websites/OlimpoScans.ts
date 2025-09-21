import { Tags } from '../Tags';
import icon from './OlimpoScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as FlatManga from './templates/FlatManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(FlatManga.pathManga, FlatManga.queryMangaTitle)
@Common.MangasMultiPageCSS(FlatManga.pathMangasMultiPage, FlatManga.queryMangas)
@Common.ChaptersSinglePageCSS(FlatManga.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('img.chapter-img[data-original]:not([data-original*="mejoras"]):not([data-original*="recluta"]):not([data-original*="zzz"])', (img: HTMLImageElement) => img.dataset.original.split('&site').at(0))
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('olimposcans', 'OlimpoScans', 'https://leerolimpo.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}