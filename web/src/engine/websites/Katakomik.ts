import { Tags } from '../Tags';
import icon from './Katakomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/katakomik\.online\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS('div.bsx a', '/list/')
@MangaStream.ChaptersSinglePageCSS('div.eph-num a')
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('katakomik', 'Katakomik', 'https://katakomik.online', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}