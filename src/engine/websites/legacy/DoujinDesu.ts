// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DoujinDesu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', `DoujinDesu`, 'https://doujindesu.id' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DoujinDesu extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'doujindesu';
        super.label = 'DoujinDesu';
        this.tags = ['hentai', 'indonesian'];
        this.url = 'https://doujindesu.id';
        this.path = '/komik-list/?list';

        this.querMangaTitleFromURI = 'div#infoarea div.post-body h1.entry-title';
        this.queryMangas = 'div.listttl ul li a';
        this.queryChapters = 'div#chapter_list div.epsleft span.lchx a';
        this.queryChaptersTitle = undefined;
        this.queryPages = 'div.reader-area img[src]:not([src=""])';
    }
}
*/