import { Tags } from '../Tags';
import icon from './AnubisScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/anubisscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
// TODO: Website merged with AsuraScans
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('anubisscans', 'Anubis Scans', 'https://asurascanstr.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}