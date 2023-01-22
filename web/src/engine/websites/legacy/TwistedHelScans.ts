// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TwistedHelScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('twistedhelscans', `TwistedHelScans`, 'http://twistedhelscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TwistedHelScans extends FoolSlide {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'twistedhelscans';
        super.label = 'TwistedHelScans';
        this.tags = [ 'manga', 'high-quality', 'english', 'scanlation' ];
        this.url = 'http://twistedhelscans.com';
        //this.path        = '/directory/';
        this.language = 'english';

        this.queryMangas = 'div.series_card a';
        this.queryChapters = 'div#staff div.staff_link > a';
    }

    /**
     *
     *
    _getMangaList( callback ) {
        super._getMangaList( ( error, mangas ) => {
            if( !error && mangas instanceof Array ) {
                mangas.forEach( m => {
                    m.title = m.title.replace( /^(ongoing|completed|dropped)/i, '' );
                } );
            }
            callback( error, mangas );
        } );
    }
}
*/