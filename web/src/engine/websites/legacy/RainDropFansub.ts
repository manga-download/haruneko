// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './RainDropFansub.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('raindropfansub', `Rain Drop Fansub`, 'https://raindropteamfan.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class RainDropFansub extends MangaReaderCMS {

    constructor() {
        super();
        super.id = 'raindropfansub';
        super.label = 'Rain Drop Fansub';
        this.tags = [ 'manga', 'webtoon', 'turkish' ];
        this.url = 'https://raindropteamfan.com';
        this.links = {
            login: 'https://raindropteamfan.com/auth/login'
        };

        this.queryMangas = 'ul.price-list li a';
        this.queryChapters = 'ul.chapters li h3.chapter-title-rtl a';
        this.language = 'tr';
    }
}
*/