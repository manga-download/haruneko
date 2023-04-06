// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangaRockTeam.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangarockteam\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangarockteam', 'Manga Rock Team', 'https://mangarockteam.com'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaRockTeam extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangarockteam';
        super.label = 'Manga Rock Team';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://mangarockteam.com';
    }
}
*/