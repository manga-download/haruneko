// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WuxiaWorld.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wuxiaworld', `WuxiaWorld`, 'https://wuxiaworld.site' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WuxiaWorld extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'wuxiaworld';
        super.label = 'WuxiaWorld';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://wuxiaworld.site';

        //this.formManga.append('vars[wp-manga-tag]', 'webcomics');
    }
}
*/