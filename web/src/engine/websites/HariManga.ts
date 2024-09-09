import { Tags } from '../Tags';
import icon from './HariManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('harimanga', 'HariManga', 'https://harimanga.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}