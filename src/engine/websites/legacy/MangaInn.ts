// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaInn.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangainn', `MangaInn`, 'http://www.mangainn.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaInn extends Connector {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'mangainn';
        super.label = 'MangaInn';
        this.tags = [ 'manga', 'english' ];
        this.url = 'http://www.mangainn.net';
        this.requestOptions.headers.set( 'x-referer', this.url );
    }

    /**
     *
     *
    _getMangaListFromPages( mangaPageLinks, index ) {
        index = index || 0;
        return this.fetchDOM( mangaPageLinks[ index ], 'div.content ul.manga-list li a.manga-info-qtip', 5 )
            .then( data => {
                let mangaList = data.map( element => {
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.trim()
                    };
                } );
                if( index < mangaPageLinks.length - 1 ) {
                    return this._getMangaListFromPages( mangaPageLinks, index + 1 )
                        .then( mangas => mangaList.concat( mangas ) );
                } else {
                    return Promise.resolve( mangaList );
                }
            } );
    }

    /**
     *
     *
    _getMangaList( callback ) {
        let pageLinks = 'abcdefghijklmnopqrstuvwxyz'.split( '' ).map( page => this.url + '/manga-list/' + page );
        pageLinks.push( this.url + '/manga-list' );
        this._getMangaListFromPages( pageLinks )
            .then( data => {
                callback( null, data );
            } )
            .catch( error => {
                console.error( error, this );
                callback( error, undefined );
            } );
    }

    /**
     *
     *
    _getChapterList( manga, callback ) {
        this.fetchDOM( this.url + manga.id, 'div#chapter_list ul.chapter-list li a' )
            .then( data => {
                let chapterList = data.map( element => {
                    let title = element.querySelector( 'span.val' ).innerText;
                    return {
                        id: this.getRelativeLink( element ) + '/all-pages',
                        title: title.replace( manga.title, '' ).replace( /^\s*-/, '' ).trim(),
                        language: 'en'
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
        let request = new Request( this.url + chapter.id, this.requestOptions );
        this.fetchDOM( request, 'div.chapter-read source.img-responsive' )
            .then( data => {
                let pageLinks = data.map( element => this.createConnectorURI( this.getAbsolutePath( element, request.url ) ) );
                callback( null, pageLinks );
            } )
            .catch( error => {
                console.error( error, chapter );
                callback( error, undefined );
            } );
    }
}
*/