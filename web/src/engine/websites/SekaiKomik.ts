// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './SekaiKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/www\.sekaikomik\.site\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sekaikomik', 'SekaiKomik', 'https://www.sekaikomik.site', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SekaiKomik extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'sekaikomik';
        super.label = 'SekaiKomik';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://www.sekaikomik.site';
        this.path = '/manga/list-mode/';
        this.requestOptions.headers.set('x-referer', this.url);
    }

    async _initializeConnector() {
        const paths = [ '/', '/manga/' ];
        for(let path of paths) {
            const uri = new URL(path, this.url);
            const request = new Request(uri, this.requestOptions);
            await Engine.Request.fetchUI(request, '', 25000, true);
        }
    }

    async _getPages(chapter) {
        const images = await super._getPages(chapter);
        return images.map(image => this.createConnectorURI(image));
    }
}
*/