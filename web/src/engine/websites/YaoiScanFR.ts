import { Tags } from '../Tags';
import icon from './YaoiScanFR.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/catalogue\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/catalogue/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS(undefined, 'ts_reader.params.sources.shift().images;')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yaoiscanfr', 'YaoiScanFR', 'https://yaoiscan.fr', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}