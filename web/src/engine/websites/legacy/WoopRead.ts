// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WoopRead.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('woopread', `WoopRead`, 'https://woopread.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WoopRead extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'woopread';
        super.label = 'WoopRead';
        this.tags = [ 'manga', 'novel', 'english' ];
        this.url = 'https://woopread.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }

    async _getChapters(manga) {
        const chapters = await super._getChapters(manga);
        return chapters.filter(chapter => chapter.id !== manga.id);
    }
}
*/