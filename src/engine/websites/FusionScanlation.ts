// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './FusionScanlation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/fusionscanlation\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.listupd div.bsx a', '/proyectos/page/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fusionscanlation', 'Fusion Scanlation', 'https://fusionscanlation.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class FusionScanlation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'fusionscanlation';
        super.label = 'Fusion Scanlation';
        this.tags = [ 'webtoon', 'spanish' ];
        this.url = 'https://fusionscanlation.com';
        this.path = '/proyectos/page/';

        this.queryMangas = 'div.listupd div.bsx a';
    }

    async _getMangas() {
        let mangaList = [];
        for(let page = 1, run = true; run; page++) {
            let mangas = await this._getMangasFromPage(page);
            mangas.length > 0 ? mangaList.push(...mangas) : run = false;
        }
        return mangaList;
    }

    async _getMangasFromPage(page) {
        const uri = new URL(this.path + page, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryMangas);
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.title.trim()
            };
        });
    }
}
*/