import { Tags } from '../Tags';
import icon from './LELScanVF.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

@Common.MangaCSS(/^https?:\/\/www\.lelscanvf\.cc\/manga\/[^/]+$/, MangaReader.queryMangaTitle)
@MangaReader.MangasSinglePageCSS()
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters, MangaReader.ChapterInfoExtractor)
@Common.PagesSinglePageCSS(MangaReader.queryPages, MangaReader.ChapterPageExtractor)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscanvf', `LELSCAN-VF`, 'https://www.lelscanvf.cc', Tags.Language.French, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}