// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './MangasOrigines.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/mangas-origines\.fr\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasorigines', 'Mangas Origines', 'https://mangas-origines.fr'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangasOrigines extends WordPressMadara {

    constructor() {
        super();
        super.id = 'mangasorigines';
        super.label = 'Mangas Origines';
        this.tags = [ 'manga', 'webtoons', 'french' ];
        this.url = 'https://mangas-origines.fr';
    }
}
*/