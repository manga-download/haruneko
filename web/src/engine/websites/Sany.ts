import { Tags } from '../Tags';
import icon from './Sany.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'h1.entry-title')
@Common.MangasSinglePageCSS('/manhwa/', 'div.animposx a', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapter_list span.lchx a')
@Common.PagesSinglePageCSS('div.reader-area img#imagech')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sany', 'Sany', 'https://sanyteam.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Vietnamese, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}