// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './PijamaliKoi.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pijamalikoi', `Pijamalı Koi`, 'https://pijamalikoi.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class PijamaliKoi extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'pijamalikoi';
        super.label = 'Pijamalı Koi';
        this.tags = [ 'manga', 'webtoon', 'turkish', 'scanlation' ];
        this.url = 'https://pijamalikoi.com';
        this.path = '/m/manga/list-mode/';
    }
}
*/