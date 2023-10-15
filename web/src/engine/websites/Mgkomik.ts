import { Tags } from '../Tags';
import icon from './Mgkomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mgkomik\.id\/komik\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageCSS(undefined, 0, '/page/{page}/' )
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mgkomik', 'MGKOMIK', 'https://mgkomik.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}