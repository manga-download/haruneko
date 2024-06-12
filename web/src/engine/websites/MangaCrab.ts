import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'div.titulodetalles')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1('li.lista-de-capitulos a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://wikicrab.xyz', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}