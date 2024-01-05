import { Tags } from '../Tags';
import icon from './DankeFursLesen.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Guya from './decorators/Guya';

@Guya.MangaAJAX(/^https?:\/\/danke\.moe\/read\/manga\//)
@Guya.MangasSinglePageAJAX()
@Guya.ChaptersSinglePageAJAX()
@Guya.PagesSinglePageAJAX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dankefurslesen', `Danke fürs Lesen`, 'https://danke.moe', Tags.Language.English, Tags.Source.Scanlator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }
}