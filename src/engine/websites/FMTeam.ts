import { Tags } from '../Tags';
import icon from './FMTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as PizzaReader from './decorators/PizzaReader';
import * as Common from './decorators/Common';

@PizzaReader.MangaAJAX(/^{origin}\/comics\/[^/]+$/)
@PizzaReader.MangasSinglePageAJAX()
@PizzaReader.ChaptersSinglePageAJAX()
@PizzaReader.PagesSinglePageAJAX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fmteam', `FMTeam`, 'https://fmteam.fr', Tags.Language.French, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}