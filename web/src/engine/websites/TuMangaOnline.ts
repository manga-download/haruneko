import { Tags } from '../Tags';
import icon from './TuMangaOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'article h1.title')
@Common.MangasMultiPageCSS('/index.php/library?_pg=1&page={page}', 'main .row > .element > a')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('tumangaonline', `TuMangaOnline`, 'https://visortmo.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}