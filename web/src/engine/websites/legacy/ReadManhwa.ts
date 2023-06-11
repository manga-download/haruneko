import { Tags } from '../../Tags';
import icon from './ReadManhwa.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Madara from '../decorators/WordPressMadara';
import * as Common from '../decorators/Common';

@Madara.MangaCSS(/^https?:\/\/manhwahentai\.to\/pornhwa\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readmanhwa', `ManhwaHentai.to`, 'https://manhwahentai.to', Tags.Language.English, Tags.Media.Manhwa, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}
