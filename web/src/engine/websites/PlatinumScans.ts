import { Tags } from '../Tags';
import icon from './PlatinumScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('platinumscans', 'PlatinumScans', 'https://platinumscans.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}