// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './IchirinNoHanaYuri.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ichirinnohanayuri', `Ichirin No Hana Yuri`, 'https://ichirinnohanayuriscan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class IchirinNoHanaYuri extends WordPressMadara {

    constructor() {
        super();
        super.id = 'ichirinnohanayuri';
        super.label = 'Ichirin No Hana Yuri';
        this.tags = [ 'hentai', 'high-quality', 'portuguese', 'scanlation' ];
        this.url = 'https://ichirinnohanayuriscan.com';
        this.queryMangas = 'div.post-title.font-title h4 a';
        this.queryChapters = 'li.wp-manga-chapter a';
    }
}
*/