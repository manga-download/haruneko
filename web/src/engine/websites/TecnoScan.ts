import { Tags } from '../Tags';
import icon from './TecnoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/tecnoscann\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('tecnoscan', 'Tecno Scan', 'https://tecnoscann.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }
    public override get Icon() {
        return icon;
    }
}
