import { Tags } from '../Tags';
import icon from './RobinManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS([], 'ts_reader.params.sources.shift().images')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('robinmanga', 'RobinManga', 'https://www.robinmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}