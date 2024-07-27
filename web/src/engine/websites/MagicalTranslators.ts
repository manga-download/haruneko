import { Tags } from '../Tags';
import icon from './MagicalTranslators.webp';
import { DecoratableMangaScraper } from './../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Guya from './decorators/Guya';

@Guya.MangaAJAX(/^{origin}\/read\/manga\/[^/]+\/$/)
@Guya.MangasSinglePageAJAX()
@Guya.ChaptersSinglePageAJAX()
@Guya.PagesSinglePageAJAX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('magicaltranslators', `Magical Translators`, 'https://mahoushoujobu.com', Tags.Language.English, Tags.Language.Spanish, Tags.Language.Polish, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}