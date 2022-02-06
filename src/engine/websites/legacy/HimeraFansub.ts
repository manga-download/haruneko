// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HimeraFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('himerafansub', `Himera Fansub`, 'https://himera-fansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HimeraFansub extends WordPressMadara {

    constructor() {
        super();
        super.id = 'himerafansub';
        super.label = 'Himera Fansub';
        this.tags = [ 'manga', 'webtoon', 'turkish'];
        this.url = 'https://himera-fansub.com';
        this.requestOptions.headers.set('x-referer', this.url);
    }
}
*/