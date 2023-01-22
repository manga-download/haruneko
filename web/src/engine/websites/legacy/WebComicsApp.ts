// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WebComicsApp.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webcomicsapp', `WebComicsApp`, 'http://www.webcomicsapp.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WebComicsApp extends Connector {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'webcomicsapp';
        super.label = 'WebComicsApp';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'http://www.webcomicsapp.com';
    }

    /**
     *
     *
    _getMangaList( callback ) {
        this.fetchDOM( this.url + '/genres.html?category=all', 'section.mangas div.row div.col-md-3 a' )
            .then( data => {
                let mangaList = data.map( element => {
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.querySelector( 'h5' ).innerText.trim()
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
     *
     *
    _getChapterList( manga, callback ) {
        this.fetchDOM( this.url + manga.id, 'section.book-info-left ul.nav li.nav-item a.nav-link' )
            .then( data => {
                let chapterList = data.map( element => {
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.replace( manga.title, '' ).trim(),
                        language: ''
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
        this.fetchDOM( this.url + chapter.id, 'section.book-reader div.book-reader-main ul.img-list li source' )
            .then( data => {
                let pageList = data.map( element => element.dataset['original'] || element.src );
                callback( null, pageList );
            } )
            .catch( error => {
                console.error( error, chapter );
                callback( error, undefined );
            } );
    }
}
*/