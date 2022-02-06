// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicTrail.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comictrail', `Comic Trail (コミックトレイル)`, 'https://comic-trail.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicTrail extends CoreView {

    constructor() {
        super();
        super.id = 'comictrail';
        super.label = 'Comic Trail (コミックトレイル)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-trail.com';

        this.path = [ '/series' ];
        this.queryManga = '#page-comicTrail-serial-serial > div div a';
        this.queryMangaTitle = 'h4';
    }

}
*/