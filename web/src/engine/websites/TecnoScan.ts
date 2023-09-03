import { Tags } from '../Tags';
import icon from './TecnoScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/tecnoscann\.com\/manga\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('tecnoscan', 'Tecno Scan', 'https://tecnoscann.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }
    public override get Icon() {
        return icon;
    }
}
