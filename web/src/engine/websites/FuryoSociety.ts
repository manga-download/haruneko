import { Tags } from '../Tags';
import icon from './FuryoSociety.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'h1.fs-comic-title')
@Common.MangasSinglePagesCSS(['/mangas'], 'span.fs-comic-title a')
@Common.ChaptersSinglePageCSS('div.fs-chapter-list div.title a', undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageCSS('div.main-img div.fs-reader-page img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('furiosociety', 'Furyo Society', 'https://furyosociety.com', Tags.Media.Manga, Tags.Language.French, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}