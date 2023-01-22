// Auto-Generated export from HakuNeko Legacy
//import { Tags } from '../Tags';
import icon from './TruyenTranhAudioOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^https?:\/\/truyentranhaudio\.online\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageDirect()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhaudioonline', 'Truyện tranh audio', 'https://truyentranhaudio.online'/*, Tags.Media., Tags.Language.*/);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TruyenTranhAudioOnline extends WordPressMadara {

    constructor() {
        super();
        super.id = 'truyentranhaudioonline';
        super.label = 'Truyện tranh audio';
        this.tags = [ 'webtoon', 'vietnamese' ];
        this.url = 'https://truyentranhaudio.online';

        this.queryPages = 'div.reading-content source';
    }
}
*/