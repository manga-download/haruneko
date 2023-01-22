// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './LELScan.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('lelscan', `LELScan`, 'https://lelscans.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class LELScan extends Connector {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'lelscan';
        super.label = 'LELScan';
        this.tags = [ 'manga', 'high-quality', 'french', 'scanlation' ];
        this.url = 'https://lelscans.net';
    }

    /**
     *
     *
    _getMangaList( callback ) {
        this.fetchDOM( this.url, 'div.outil_lecture ul li a' )
            .then( data => {
                let mangaList = data.map( element => {
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.replace( 'scan', '' ).trim()
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
        this.fetchDOM( this.url + manga.id, 'div#header-image form select:first-of-type option' )
            .then( data => {
                let chapterList = data.map( element => {
                    let uri = new URL( element.value, this.url );
                    return {
                        id: uri.pathname + uri.search,
                        title: element.text.trim(),
                        language: 'fr'
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
        this.fetchDOM( request, 'div#navigation a' )
            .then( data => {
                let pageList = data
                    .filter( element => parseInt( element.text.trim() ) )
                    .map( element => this.createConnectorURI( this.getAbsolutePath( element, request.url ) ) );
                callback( null, pageList );
            } )
            .catch( error => {
                console.error( error, chapter );
                callback( error, undefined );
            } );
    }

    /**
     *
     *
    _handleConnectorURI( payload ) {
        let request = new Request( payload, this.requestOptions );
        /*
         * TODO: only perform requests when from download manager
         * or when from browser for preview and selected chapter matches
         *
        return this.fetchDOM( request, 'div#image source' )
            .then( data => super._handleConnectorURI( this.getAbsolutePath( data[0], request.url ) ) );
    }
}
*/