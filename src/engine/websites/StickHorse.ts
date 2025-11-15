import { Tags } from '../Tags';
import icon from './StickHorse.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'meta[property="og:title"]:not([content*="Stick Horse"])')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('stickhorse', 'Stick Horse', 'https://www.stickhorse.cl', Tags.Media.Comic, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}