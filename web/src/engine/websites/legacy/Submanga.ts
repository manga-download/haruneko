// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Submanga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('submanga', `Submanga`, 'https://submanga.io' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Submanga extends Connector {

    constructor() {
        super();
        super.id = 'submanga';
        super.label = 'Submanga';
        this.tags = [ 'manga', 'webtoon', 'spanish' ];
        this.url = 'https://submanga.io';
        this.links = {
            login: 'https://submanga.io/auth/login'
        };
    }

    /**
     * Very similar to MangaReaderCMS
     *
    _getMangaList( callback ) {
        this.fetchDOM( this.url + '/changeMangaList?type=text', 'div.panel-body ul.manga-list li a.alpha-link' )
            .then( data => {
                let mangaList = data.map( element => {
                    this.cfMailDecrypt( element );
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.trim()
                    };
                } );
                callback( null, mangaList );
            } )
            .catch( error => {
                console.error( error, this );
                callback( error, undefined );
            } );
    }

    /**
     * Same as in <LeoManga>
     *
    _getChapterList( manga, callback ) {
        this.fetchDOM( this.url + manga.id, 'div.capitulos-list table.table tbody tr td:first-of-type a' )
            .then( data => {
                let chapterList = data.map( element => {
                    this.cfMailDecrypt( element );
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.replace( manga.title, '' ).trim(),
                        language: 'spanish'
                    };
                } );
                callback( null, chapterList );
            } )
            .catch( error => {
                console.error( error, manga );
                callback( error, undefined );
            } );
    }

    /**
     *
     *
    _getPageList( manga, chapter, callback ) {
        this.fetchDOM( this.url + chapter.id, 'div#all source.img-responsive' )
            .then( data => {
                let pageLinks = data.map( element => element.dataset.src.trim() );
                callback( null, pageLinks );
            } )
            .catch( error => {
                console.error( error, chapter );
                callback( error, undefined );
            } );
    }
}
*/