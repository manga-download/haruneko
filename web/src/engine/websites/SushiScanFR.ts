import { Tags } from '../Tags';
import icon from './SushiScanFR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sushiscan\.fr\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sushiscanfr', 'Sushi Scans (FR)', 'https://sushiscan.fr', Tags.Media.Manga, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}