// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TurkceManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('turkcemanga', `Turkce Manga`, 'https://www.turkcemanga.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TurkceManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'turkcemanga';
        super.label = 'Turkce Manga';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://www.turkcemanga.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.queryMangas = 'div.post-title h3 a:not([target]), div.post-title h5 a:not([target])';
    }
}
*/