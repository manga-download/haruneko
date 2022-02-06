// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WordExcerpt.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wordexcerpt', `Word Excerpt`, 'https://wordexcerpt.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WordExcerpt extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'wordexcerpt';
        super.label = 'Word Excerpt';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://wordexcerpt.com';
        this.links = {
            login: 'https://wordexcerpt.com/login/'
        };

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/