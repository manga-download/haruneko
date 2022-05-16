// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './BetaFox.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('betafox', `Beta Fox`, 'https://www.betafox.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class BetaFox extends WordPressMadara {

    constructor() {
        super();
        super.id = 'betafox';
        super.label = 'Beta Fox';
        this.tags = [ 'manga', 'webtoon', 'hentai', 'english' ];
        this.url = 'https://www.betafox.net';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/