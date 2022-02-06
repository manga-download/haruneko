// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './HoshiNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hoshinofansub', `HoshiNoFansub`, 'http://manga.animefrontline.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class HoshiNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'hoshinofansub';
        super.label = 'HoshiNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://manga.animefrontline.com';
        //this.path        = '/directory/';
        this.language = 'spanish';
    }

    /**
     *
     *
    _getMangaList( callback ) {
        super._getMangaList( ( error, mangas ) => {
            if( !error && mangas instanceof Array ) {
                mangas.forEach( m => {
                    m.title = m.title.replace( /\s*[([](completa|one[\s-]?shot)[\])]\s*$/i, '' );
                } );
            }
            callback( error, mangas );
        } );
    }
}
*/