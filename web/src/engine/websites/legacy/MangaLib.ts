// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MangaLib.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalib', `MangaLib`, 'https://mangalib.me' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaLib extends Connector {

    constructor() {
        super();
        super.id = 'mangalib';
        super.label = 'MangaLib';
        this.tags = [ 'manga', 'webtoon', 'russian' ];
        this.url = 'https://mangalib.me';
    }

    async _getMangaFromURI(uri) {
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'meta[itemprop="alternativeHeadline"]');
        let id = uri.pathname + uri.search;
        let title = data[0].content.trim();
        return new Manga(this, id, title);
    }

    /**
     *
     *
    _getMangaListFromPages( token, page ) {
        page = page || 1;
        this.requestOptions.method = 'POST';
        let request = new Request( this.url + '/filterlist?dir=desc&page=' + page, this.requestOptions );
        request.headers.set( 'x-csrf-token', token );
        this.requestOptions.method = 'GET';
        return this.fetchJSON( request )
            .then( data => {
                let mangaList = data.items.data.map( item => {
                    return {
                        id: '/' + item.slug,
                        title: item.name // name, rus_name
                    };
                } );
                // currently MangaLib seems to be capped at page 20 (1200 mangas)
                if( data.items.current_page === page ) {
                    return this._getMangaListFromPages( token, page + 1 )
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
        let request = new Request( this.url + '/manga-list', this.requestOptions );
        this.fetchDOM( request, 'meta[name="_token"]' )
            .then( data => this._getMangaListFromPages( data[0].content ) )
            .then( data => {
                callback( null, data );
            } )
            .catch( error => {
                console.error( error, this );
                callback( error, undefined );
            } );
    }

    async _getChapters(manga) {
        const script = `
            new Promise(resolve => {
                const chapters = window.__DATA__.chapters.list.map(entry => {
                    return {
                        id: '/' + window.__DATA__.manga.slug + '/v' + entry.chapter_volume + '/c' + entry.chapter_number,
                        title: entry.chapter_number + (entry.chapter_name ? ' - ' + entry.chapter_name : '')
                    };
                });
                resolve(chapters);
            });
        `;
        let uri = new URL(manga.id, this.url);
        let request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }

    async _getPages(chapter) {
        let script = `
            new Promise(resolve => {
                resolve(window.__pg.map(page => window.__info.servers.main + window.__info.img.url + page.u));
            });
        `;
        let uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        return Engine.Request.fetchUI(request, script);
    }
}
*/