// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './ReaperScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscans', `Reaper Scans`, 'https://reaperscans.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class ReaperScans extends WordPressMadara {

    constructor() {
        super();
        super.id = 'reaperscans';
        super.label = 'Reaper Scans';
        this.tags = ['webtoon', 'english'];
        this.url = 'https://reaperscans.com';
        this.links = {
            login: 'https://reaperscans.com/login'
        };
        this.queryChapters = 'div.chapter-link > a';
        this.queryChaptersTitleBloat = 'span.chapter-release-date';
    }

}
*/