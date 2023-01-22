// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './NovelFrance.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/novel-france\.fr\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('novelfrance', 'Novel France', 'http://novel-france.fr'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NovelFrance extends WordPressMadara {

    constructor() {
        super();
        super.id = 'novelfrance';
        super.label = 'Novel France';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'http://novel-france.fr';
    }
}
*/