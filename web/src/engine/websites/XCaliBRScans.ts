// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './XCaliBRScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/xcalibrscans\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xcalibrscans', 'xCaliBR Scans', 'https://xcalibrscans.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class XCaliBRScans extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'xcalibrscans';
        super.label = 'xCaliBR Scans';
        this.tags = [ 'webtoon', 'english' ];
        this.url = 'https://xcalibrscans.com';
        this.path = '/manga/list-mode/';
        this.requestOptions.headers.set('x-referer', this.url);

        this.config = {
            throttle: {
                label: 'Throttle Requests [ms]',
                description: 'Enter the timespan in [ms] to delay consecuitive HTTP requests.\nThe website may block images for to many consecuitive requests.',
                input: 'numeric',
                min: 1000,
                max: 7500,
                value: 1500
            }
        };
    }

    async _getPages(chapter) {
        const images = await super._getPages(chapter);
        return images.map(image => this.createConnectorURI(image));
    }
}
*/