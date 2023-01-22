import { Tags } from '../Tags';
import icon from './ChibiManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/www\.cmreader\.info\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Common.PagesSinglePageJS(`chapter_preloaded_images`, 2500)
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('chibimanga', 'ChibiManga', 'https://www.cmreader.info', Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}