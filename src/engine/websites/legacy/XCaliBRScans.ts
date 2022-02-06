// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './XCaliBRScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('xcalibrscans', `xCaliBR Scans`, 'https://xcalibrscans.com' /*, Tags.Language.English, Tags ... */);
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