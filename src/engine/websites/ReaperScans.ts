// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './ReaperScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/reaperscans\.com\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('reaperscans', 'Reaper Scans', 'https://reaperscans.com'/*, Tags.Media., Tags.Language.*/);
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