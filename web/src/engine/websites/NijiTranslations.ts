import { Tags } from '../Tags';
import icon from './NijiTranslations.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/niji-translations\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('nijitranslations', 'مدونة نيجي (Niji Translations)', 'https://niji-translations.com', Tags.Media.Manga, Tags.Language.Arabic, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}