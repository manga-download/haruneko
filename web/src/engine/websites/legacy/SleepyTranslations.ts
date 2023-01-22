// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './SleepyTranslations.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sleepytranslations', `Sleepy Translations`, 'https://sleepytranslations.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class SleepyTranslations extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'sleepytranslations';
        super.label = 'Sleepy Translations';
        this.tags = [ 'webtoon', 'novel', 'english' ];
        this.url = 'https://sleepytranslations.com';

        this.novelObstaclesQuery = 'div#text-chapter-toolbar, div.ad, div.go-to-top';
    }
}
*/