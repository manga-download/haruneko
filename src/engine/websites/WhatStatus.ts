// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './WhatStatus.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/whatstatus\.co\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('whatstatus', 'WhatStatus', 'https://whatstatus.co'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WhatStatus extends WordPressMadara {

    constructor() {
        super();
        super.id = 'whatstatus';
        super.label = 'WhatStatus';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://whatstatus.co';
    }
}
*/