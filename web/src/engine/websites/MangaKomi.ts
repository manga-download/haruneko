import { Tags } from '../Tags';
import icon from './MangaKomi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangakomi\.io\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangakomi', 'Manga Komi', 'https://mangakomi.io', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Media.Manga, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}