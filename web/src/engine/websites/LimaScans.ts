import { Tags } from '../Tags';
import icon from './LimaScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/limascans\.xyz\/v2\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX('div.post-title h3 a', 0, '/v2')
@Madara.ChaptersSinglePageAJAXv1('ul li.wp-manga-chapter > a', '/v2')
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('limascans', 'Lima Scans', 'http://limascans.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}