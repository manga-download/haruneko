// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LatestManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('topmanhuanet', `LatestManga`, 'https://latestmanga.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LatestManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'topmanhuanet';
        super.label = 'LatestManga';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://latestmanga.net';
    }
}
*/