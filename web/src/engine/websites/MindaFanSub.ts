// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MindaFanSub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mindafansub\.me\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mindafansub', 'Minda Fansub', 'https://mindafansub.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MindaFanSub extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mindafansub';
        super.label = 'Minda Fansub';
        this.tags = ['webtoon', 'turkish', 'scanlation'];
        this.url = 'https://mindafansub.me';
        this.path = '/manga/list-mode/';
    }
}
*/