// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './GSNation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/gs-nation\.fr\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gsnation', 'Gs-Nation', 'https://gs-nation.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.French);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GSNation extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'gsnation';
        super.label = 'Gs-Nation';
        this.tags = [ 'webtoon', 'french' ];
        this.url = 'https://gs-nation.fr';
        this.path = '/manga/list-mode/';
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