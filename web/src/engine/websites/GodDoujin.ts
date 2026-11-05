import { Tags } from '../Tags';
import icon from './GodDoujin.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@Common.PagesSinglePageJS('ts_reader.params.sources.shift().images;', 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('goddoujin', 'God-Doujin', 'https://god-doujin.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
