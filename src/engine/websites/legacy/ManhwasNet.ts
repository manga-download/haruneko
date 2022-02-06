// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManhwasNet.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhwasnet', `Manhwas`, 'https://manhwas.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManhwasNet extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manhwasnet';
        super.label = 'Manhwas';
        this.tags = [ 'webtoon', 'hentai', 'spanish' ];
        this.url = 'https://manhwas.net';
        this.path = '/manga-list/?list';

        this.queryMangas = 'div.listttl ul li a';
        this.queryChapters = 'div#chapter_list span.eps a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/