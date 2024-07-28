import { Tags } from '../Tags';
import icon from './Hachirumi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Guya from './decorators/Guya';

@Guya.MangaAJAX(/^{origin}\/read\/manga\/[^/]+\/$/)
@Guya.MangasSinglePageAJAX()
@Guya.ChaptersSinglePageAJAX()
@Guya.PagesSinglePageAJAX()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hachirumi', `Hachirumi`, 'https://hachirumi.com', Tags.Language.English, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}