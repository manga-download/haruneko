// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReadComicBooksOnline.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('readcomicbooksonline', `ComicPunch`, 'https://comicpunch.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReadComicBooksOnline extends Connector {

    /**
     *
     *
    constructor() {
        super();
        super.id = 'readcomicbooksonline';
        super.label = 'ComicPunch';
        this.tags = [ 'comic', 'english' ];
        this.url = 'https://comicpunch.net';
    }

    /**
     *
     *
    _getMangaList( callback ) {
        let request = new Request( this.url + '/comics-list', this.requestOptions );
        this.fetchDOM( request, 'div#block-system-main div.view-content table tbody tr td a' )
            .then( data => {
                let mangaList = data.map( element => {
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
     *
     *
    _getChapterList( manga, callback ) {
        this.fetchDOM( this.url + manga.id, 'div.field-item li.chapter a' )
            .then( data => {
                let chapterList = data.map( element => {
                    return {
                        id: this.getRelativeLink( element ),
                        title: element.text.replace( manga.title, '' ).trim(),
                        language: 'en'
                    };
                } ).filter( chapter => chapter.title !== '' );
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
    async _getPages(chapter) {
        let request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        let data = await this.fetchRegex(request, /messages\s*=\s*(\[[^\]]+\])\s*;/g);
        data = Object.values(JSON.parse(data[0]));
        return data.map(element => this.getAbsolutePath(element, request.url));
    }

    /**
     *
     *
    _handleConnectorURI( payload ) {
        /*
         * TODO: only perform requests when from download manager
         * or when from browser for preview and selected chapter matches
         *
        this.requestOptions.headers.set( 'x-referer', payload.referer );
        let promise = super._handleConnectorURI( payload.url );
        this.requestOptions.headers.delete( 'x-referer' );
        return promise;
    }
}
*/