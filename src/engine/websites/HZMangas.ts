import { Tags } from '../Tags';
import icon from './HZMangas.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/hzmangas\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hzmangas', 'Hz Manga', 'https://hzmangas.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}