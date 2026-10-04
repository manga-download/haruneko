import { Tags } from '../Tags';
import icon from './EcchiDoujin.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^{origin}\/doujin\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/doujin/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('ecchidoujin', 'Ecchi-Doujin', 'https://ecchi-doujin.com', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Thai, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
