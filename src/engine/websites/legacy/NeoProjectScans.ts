// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './NeoProjectScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('neoprojectscans', `NeoProjectScans`, 'http://npscan.mangaea.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class NeoProjectScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'neoprojectscans';
        super.label = 'NeoProjectScans';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://npscan.mangaea.net';
        this.path = '/slide/directory/';
        this.language = 'spanish';

        this.defaultPageCount = 5;
        this.queryMangas = 'div.directory div.grid div.grid-item a';
        this.queryChapters = 'div.list div.list-group div.list-group-item div.title a';
    }
}
*/