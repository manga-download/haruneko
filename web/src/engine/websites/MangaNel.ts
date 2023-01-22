import { Tags } from '../Tags';
import icon from './MangaNel.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaNel from './decorators/MangaNel';
import * as Common from './decorators/Common';

@MangaNel.MangaCSS(/^https?:\/\/(m\.|chap\.)?(read)?manganato\.com\/manga-/)
@MangaNel.MangasMultiPageCSS()
@MangaNel.ChaptersSinglePageCSS()
@MangaNel.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manganel', 'Manganato', 'https://manganato.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}