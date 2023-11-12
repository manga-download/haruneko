import { Tags } from '../Tags';
import icon from './HentaiZone.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaizone', 'HentaiZone', 'https://hentaizone.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}