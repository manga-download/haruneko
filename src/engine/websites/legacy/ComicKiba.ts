// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicKiba.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comickiba', `Comic Kiba`, 'https://comickiba.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicKiba extends WordPressMadara {

    constructor() {
        super();
        super.id = 'comickiba';
        super.label = 'Comic Kiba';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://comickiba.com';

        this.queryPages = 'div.page-break source, li.blocks-gallery-item source';
    }
}
*/