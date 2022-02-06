// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './DongManManhua.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dongmanmanhua', `咚漫 (DongMan Manhua)`, 'https://www.dongmanmanhua.cn' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class DongManManhua extends LineWebtoon {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'dongmanmanhua';
        super.label = '咚漫 (DongMan Manhua)'; // Chinese Simplified
        this.tags = [ 'webtoon', 'chinese' ];
        this.url = 'https://www.dongmanmanhua.cn';
        this.baseURL = this.url;
        this.requestOptions.headers.set( 'x-referer', this.url );
    }

    /**
     *
     *
    get icon() {
        return '/img/connectors/' + this.id;
    }

    /**
     *
     *
    _getMangaList( callback ) {
        let request = new Request( this.url + '/dailySchedule', this.requestOptions );
        this.fetchDOM( request, 'div.daily_lst ul.daily_card li a.daily_card_item' )
            .then( data => {
                let mangaList = data.map( element => {
                    return {
                        id: this.getRootRelativeOrAbsoluteLink( element, request.url ),
                        title: element.querySelector( 'p.subj' ).innerText.trim()
                    };
                } );
                callback( null, mangaList );
            } )
            .catch( error => {
                console.error( error, this );
                callback( error, undefined );
            } );
    }
}
*/