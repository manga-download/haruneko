// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Ikifeng.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ikifeng', `Ikifeng`, 'https://ikifeng.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Ikifeng extends WordPressMadara {
    constructor() {
        super();
        super.id = "ikifeng";
        super.label = "Ikifeng";
        this.tags = ["manga", "webtoon", "hentai", "spanish"];
        this.url = "https://ikifeng.com";
    }

    canHandleURI(uri) {
        return /https?:\/\/ikifeng\.com/.test(uri.origin);
    }
}
*/