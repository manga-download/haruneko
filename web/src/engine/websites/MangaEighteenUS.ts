// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaEighteenUS.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/manhuascan\.us\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.listupd div.bsx > a', '/manga-list?page=')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('manga18-us', 'Manhuascan.us (Manga18.us)', 'https://manhuascan.us', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaEighteenUS extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'manga18-us';
        super.label = 'Manhuascan.us (Manga18.us)';
        this.tags = [ 'webtoon', 'hentai', 'english' ];
        this.url = 'https://manhuascan.us';
        this.path = '/manga-list?page=';

        this.queryMangas = 'div.listupd div.bsx > a';
    }

    async _getMangas() {
        const mangaList = [];
        for(let page = 1, run = true; run; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL(this.path + page, this.url);
        const request = new Request(uri, this.requestOptions);
        const data = await this.fetchDOM(request, this.queryMangas);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.title.trim()
            };
        });
    }
}
*/