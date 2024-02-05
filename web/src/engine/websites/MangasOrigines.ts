import { Tags } from '../Tags';
import icon from './MangasOrigines.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/oeuvre\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS('div.page-break noscript img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasorigines', 'Mangas Origines', 'https://mangas-origines.fr', Tags.Media.Manhwa, Tags.Media.Manga, Tags.Media.Manhua, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}