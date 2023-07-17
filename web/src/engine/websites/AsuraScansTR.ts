import { Tags } from '../Tags';
import icon from './AsuraScansTR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/asurascanstr\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([/ENDING-PAGE/i])
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('asurascans-tr', `Asura Scans (TR)`, 'https://asurascanstr.com', Tags.Language.Turkish, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }
}
