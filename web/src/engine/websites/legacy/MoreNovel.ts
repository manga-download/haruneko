// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MoreNovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('morenovel', `Morenovel`, 'https://risenovel.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MoreNovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'morenovel';
        super.label = 'Morenovel';
        this.tags = [ 'novel', 'indonesian' ];
        this.url = 'https://risenovel.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/