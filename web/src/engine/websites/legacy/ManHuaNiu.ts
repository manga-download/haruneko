// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ManHuaNiu.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manhuaniu', `漫画牛 (ManHuaNiu)`, 'https://www.manhuaniu.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ManHuaNiu extends SinMH {

    constructor() {
        super();
        super.id = 'manhuaniu';
        super.label = '漫画牛 (ManHuaNiu)';
        this.tags = [ 'webtoon', 'hentai', 'chinese' ];
        this.url = 'https://www.manhuaniu.com';
        this.requestOptions.headers.set('x-referer', this.url);
        this.queryChapters = 'div.comic-chapters ul li a:not([href*="javascript"])';
    }
}
*/