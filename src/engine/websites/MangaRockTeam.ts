import { Tags } from '../Tags';
import icon from './MangaRockTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarockteam', 'Manga Rock Team', 'https://mangarockteam.com', Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}