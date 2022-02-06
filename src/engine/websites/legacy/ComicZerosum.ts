// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ComicZerosum.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('comiczerosum', `Comic ゼロサム (Comic ZEROSUM)`, 'https://online.ichijinsha.co.jp/zerosum' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ComicZerosum extends SpeedBinb {

    constructor() {
        super();
        super.id = 'comiczerosum';
        super.label = 'Comic ゼロサム (Comic ZEROSUM)';
        this.tags = ['manga', 'japanese'];
        this.url = 'https://online.ichijinsha.co.jp/zerosum';
        this.data_url = 'https://online.ichijinsha.co.jp/json/zerosum';
    }

    async _getMangas() {
        const request = new Request(`${this.data_url}/list/name.json`, this.requestOptions);
        const data = await this.fetchJSON(request);

        return data.Stories.map(story => {
            return {
                id: story.Work.Tag,
                title: story.Work.Name
            };
        });
    }

    async _getChapters(manga) {
        const request = new Request(`${this.data_url}/works/${manga.id}.json`, this.requestOptions);
        const data = await this.fetchJSON(request);

        return data.Work.Stories.map(story => {
            return {
                id: story.Url,
                title: story.Name
            };
        });
    }
}
*/