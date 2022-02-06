// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DangolineNoFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dangolinenofansub', `DangolineNoFansub`, 'http://lector.dangolinenofansub.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DangolineNoFansub extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'dangolinenofansub';
        super.label = 'DangolineNoFansub';
        this.tags = [ 'manga', 'high-quality', 'spanish', 'scanlation' ];
        this.url = 'http://lector.dangolinenofansub.com';
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
                    m.title = m.title.replace( /\s+\|\s+.*, '' );
                } );
            }
            callback( error, mangas );
        } );
    }
}
*/