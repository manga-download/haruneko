import { Tags } from '../Tags';
import icon from './DoujinMitai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/doujinmitai\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujinmitai', 'DoujinMitai', 'https://doujinmitai.com', Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}