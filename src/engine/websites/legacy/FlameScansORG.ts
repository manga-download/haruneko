// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './FlameScansORG.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('flamescans-org', `Flame Scans`, 'https://flamescans.org' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FlameScansORG extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'flamescans-org';
        super.label = 'Flame Scans';
        this.tags = [ 'manga', 'webtoon', 'english' ];
        this.url = 'https://flamescans.org';
        this.path = '/series/list-mode/';

        this.queryMangas = 'div.postbody div.soralist ul li a.series';
        this.queryChapters = 'div#chapterlist ul li a';
    }
}
*/