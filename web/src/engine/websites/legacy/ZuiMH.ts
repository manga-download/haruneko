// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ZuiMH.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('zuimh', `最漫画 (ZuiMH)`, 'https://www.zuimh.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ZuiMH extends SinMH {
//dead?
    constructor() {
        super();
        super.id = 'zuimh';
        super.label = '最漫画 (ZuiMH)';
        this.tags = [ 'manga', 'webtoon', 'chinese' ];
        this.url = 'https://www.zuimh.com';
        this.config = {
            throttle: {
                label: 'Page Throttle Requests [ms]',
                description: 'Enter the timespan in [ms] to delay consecuitive HTTP requests while downloading Pages.\nThe website may ban your IP for to many consecuitive requests.',
                input: 'numeric',
                min: 500,
                max: 10000,
                value: 2500
            }
        };
    }
}
*/