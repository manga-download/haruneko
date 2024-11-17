import { Tags } from '../Tags';
import icon from './Opiatoon.webp';
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
        super('opiatoon', 'Opiatoon (Opia&Shipperland)', 'https://opiatoon.pro', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}