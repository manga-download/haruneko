// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Lindovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lindovel', `Lindovel`, 'https://lindovel.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Lindovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'lindovel';
        super.label = 'Lindovel';
        this.tags = [ 'novel', 'indonesian' ];
        this.url = 'https://lindovel.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.go-to-top, p[style*="color:red"]';
    }
}
*/