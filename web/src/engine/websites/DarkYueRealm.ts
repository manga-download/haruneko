import { Tags } from '../Tags';
import icon from './DarkYueRealm.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/darkyuerealm\.site\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
// TODO: Website moved to https://darkyuerealm.wixsite.com/darkyue-realm/mangas
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('darkyuerealm', 'DarkYue Realm', 'https://darkyuerealm.site', Tags.Media.Manga, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}