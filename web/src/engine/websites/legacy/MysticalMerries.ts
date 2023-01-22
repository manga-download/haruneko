// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MysticalMerries.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mysticalmerries', `Mystical Merries`, 'https://mysticalmerries.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MysticalMerries extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'mysticalmerries';
        super.label = 'Mystical Merries';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://mysticalmerries.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/