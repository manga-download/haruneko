import { Tags } from '../Tags';
import icon from './SushiScansCOM.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([], 'ts_reader.params.sources.shift().images;')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sushiscanscom', 'Sushi Scans (.COM)', 'https://sushi-scan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}