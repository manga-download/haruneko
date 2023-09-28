import { Tags } from '../Tags';
import icon from './MangaWOW.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangawow\.com\/manga\/[^/]+\/$/,'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangawow', 'MangaWOW', 'https://mangawow.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}