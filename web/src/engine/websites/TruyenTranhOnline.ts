// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './TruyenTranhOnline.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        // TODO: Is tutientruyen5.xyz the correct new domain?
        super('truyentranhaudioonline', 'Truyện tranh online', 'https://protruyen5.xyz', Tags.Media.Manhwa, Tags.Language.Vietnamese, Tags.Source.Aggregator);
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