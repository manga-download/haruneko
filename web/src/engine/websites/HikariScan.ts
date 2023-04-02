import { Tags } from '../Tags';
import icon from './HikariScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/hikariscan\.com\.br\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hikariscan', 'Hikari Scan', 'https://hikariscan.com.br', Tags.Media.Manga, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}