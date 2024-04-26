import { Tags } from '../Tags';
import icon from './MangaMonarca.webp';
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
        super('mangamonarca', 'Monarcamanga', 'https://visormonarca.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}