import { Tags } from '../Tags';
import icon from './AzoraWorld.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/azoraworld\.com\/series\/[^/]+\/$/, 'div.post-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
// TODO: Website merged with azoramanga
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('azoraworld', 'ازورا مانجا (AZORA MANGA)', 'https://azoraworld.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}