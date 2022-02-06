// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicDays.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comicdays', `コミックDAYS (Comic Days)`, 'https://comic-days.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicDays extends CoreView {

    constructor() {
        super();
        super.id = 'comicdays';
        super.label = 'コミックDAYS (Comic Days)';
        this.tags = [ 'manga', 'japanese' ];
        this.url = 'https://comic-days.com';

        this.path = [ '/oneshot', '/newcomer', '/daysneo' ];
        this.queryManga = 'div.yomikiri-container ul.yomikiri-items > li.yomikiri-item-box > a.yomikiri-link';
        this.queryMangaTitle = 'div.yomikiri-link-title h4';
    }

    async _getMangaListFromPages(path, queryLink, queryTitle) {
        let request = new Request(this.url + path, this.requestOptions);
        let data = await this.fetchDOM(request, queryLink);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.querySelector(queryTitle).getAttribute('alt').trim()
            };
        });
    }

    async _getMangas() {
        let series = await this._getMangaListFromPages('/series', 'section.daily ul.daily-series > li.daily-series-item a.link', 'source');
        let magazines = await this._getMangaListFromPages('/magazine', 'a.barayomi-magazine-list-link-latest', 'source.barayomi-magazine-series-image');
        let mangas = await super._getMangas();
        let mangaList = [...series, ...magazines, ...mangas];
        // remove mangas with same title but different ID
        return mangaList.filter(manga => manga === mangaList.find(m => m.title === manga.title));
    }

    async _getChapters(manga) {
        if(/^\/magazine\/\d+$/.test(manga.id)) {
            return [{
                id: manga.id,
                title: manga.title
            }];
        } else {
            return super._getChapters(manga);
        }
    }
}
*/