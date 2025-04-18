import { Tags } from '../Tags';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import icon from './OnMangaMe.webp';
import * as Common from './decorators/Common';
import * as MangaReader from './templates/MangaReaderCMS';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.single-managa div.panel-heading') //yes, its managa, not manga
@Common.MangasSinglePagesCSS([MangaReader.patternMangas], MangaReader.queryMangas)
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('on-manga', `مانجا اون لاين (On-Manga)`, 'https://onma.me', Tags.Language.Arabic, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}