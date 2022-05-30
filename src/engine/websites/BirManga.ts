import { Tags } from '../Tags';
import icon from './BirManga.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/birmanga\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
// TODO: Website no longer exist?
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('birmanga', 'Bir Manga', 'https://birmanga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish);
    }

    public override get Icon() {
        return icon;
    }
}