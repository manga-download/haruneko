// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ShueishaMangaPlus.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('shueishamangaplus', `MANGA Plus by Shueisha`, 'https://mangaplus.shueisha.co.jp' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ShueishaMangaPlus extends Publus {

    constructor() {
        super();
        super.id = 'shueishamangaplus';
        super.label = 'MANGA Plus by Shueisha';
        this.tags = [ 'manga', 'high-quality', 'english', 'spanish' ];
        this.url = 'https://mangaplus.shueisha.co.jp';
        this.apiURL = 'https://jumpg-webapi.tokyo-cdn.com';
        this.protoTypes = '/mjs/connectors/ShueishaMangaPlus.proto';
        this.rootType = 'MangaPlus.Response';
    }

    async _getMangaFromURI(uri) {
        let id = uri.pathname.match(/\/(\d+)$/)[1];
        uri = new URL('/api/title_detail', this.apiURL);
        uri.searchParams.set('title_id', id);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchPROTO(request, this.protoTypes, this.rootType);
        let title = data.success.titleDetailView.title;
        title = title.name + (title.language ? ' [es]' : ' [en]');
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let request = new Request(new URL('/api/title_list/all', this.apiURL), this.requestOptions);
        let data = await this.fetchPROTO(request, this.protoTypes, this.rootType);
        return data.success.allTitlesView.titles.map(manga => {
            return {
                id: manga.titleId,
                title: manga.name + (manga.language ? ' [es]' : ' [en]')
            };
        });
    }

    async _getChapters(manga) {
        let uri = new URL('/api/title_detail', this.apiURL);
        uri.searchParams.set('title_id', manga.id);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchPROTO(request, this.protoTypes, this.rootType);
        return [
            ...data.success.titleDetailView.firstChapterList || [],
            ...data.success.titleDetailView.lastChapterList || []
        ].map(chapter => {
            return {
                id: chapter.chapterId,
                title: chapter.subTitle || chapter.name,
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let uri = new URL('/api/manga_viewer', this.apiURL);
        uri.searchParams.set('chapter_id', chapter.id);
        uri.searchParams.set('img_quality', 'super_high');
        uri.searchParams.set('split', 'yes');
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchPROTO(request, this.protoTypes, this.rootType);
        return data.success.mangaViewer.pages
            .filter(page => page.mangaPage)
            .map(page => {
                let image = page.mangaPage;
                image = Object.assign(image, {
                    mode: image.encryptionKey ? 'xor' : 'raw',
                    encryption: {
                        pattern: null,
                        key: image.encryptionKey
                    }
                });
                return image.mode === 'raw' ? image.imageUrl : this.createConnectorURI(image);
            });
    }
}
*/