// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './WorldRomanceTranslation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/wrt\.my\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS('div#chapterlist ul li div.eph-num a:last-of-type')
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('worldromancetranslation', 'World Romance Translation', 'https://wrt.my.id', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class WorldRomanceTranslation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'worldromancetranslation';
        super.label = 'World Romance Translation';
        this.tags = ['manga', 'indonesian'];
        this.url = 'https://wrt.my.id';
        this.path = '/manga/list-mode/';

        this.queryChapters = 'div#chapterlist ul li div.eph-num a:last-of-type';
    }

    async _getPages(chapter) {
        const images = await super._getPages(chapter);
        return images.map(link => this.createConnectorURI({
            url: link,
            referer: this.url
        }));
    }

    async _handleConnectorURI(payload) {
        let request = new Request(payload.url, this.requestOptions);
        request.headers.set('x-referer', payload.referer);
        let response = await fetch(request);
        let data = await response.blob();
        return this._blobToBuffer(data);
    }
}
*/