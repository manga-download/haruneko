// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './WeComics.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('wecomics', `WeComics`, 'https://m.wecomics.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WeComics extends Connector {

    constructor() {
        super();
        super.id = 'wecomics';
        super.label = 'WeComics';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://m.wecomics.com';
    }

    async _getMangaFromURI(uri) {
        const id = uri.searchParams.get('id');
        const request = new Request(new URL('/h5/comic/detail/id/' + id, this.url), this.requestOptions);
        const data = await this.fetchJSON(request);
        const title = data.data.comic.title;
        return new Manga(this, id, title);
    }

    async _getMangas() {
        let mangaList = [];
        for(let page = 1, run = true; run; page++) {
            let mangas = await this._getMangasFromPage(page);
            page < 250 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        let uri = new URL('/h5/home/getWaterFallComicList/page/' + page, this.url);
        let request = new Request(uri, this.requestOptions );
        let data = await this.fetchJSON(request);
        return data.data.data_list.map(manga => {
            return {
                id: manga.comic_id,
                title: manga.title.trim()
            };
        });
    }

    async _getChapters(manga) {
        let uri = new URL('/h5/comic/detail/id/' + manga.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchJSON(request);
        // TODO: filter non-purchased chapters?
        return data.data.chapter_list.map(chapter => {
            return {
                id: chapter.chapter_id,
                title: chapter.title.trim(),
                language: ''
            };
        });
    }

    async _getPages(chapter) {
        let uri = new URL(`/h5/comic/getPictureList/id/${chapter.manga.id}/cid/${chapter.id}`, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchJSON(request);
        if(data.error_code !== 2) {
            throw new Error(`Failed to get chapter images (Error: ${data.error_code} - ${data.msg})!`);
        }
        if(!data.data.chapter.data) {
            throw new Error('No image data available, make sure your account is logged in and the chapter is purchased!');
        }
        data = WeComics_Vendor.getPictureList(data.data.chapter.data);
        return data.map(image => image.replace('_800', '_1200'));
    }
}
*/