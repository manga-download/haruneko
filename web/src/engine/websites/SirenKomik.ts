import { Tags } from '../Tags';
import icon from './SirenKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/sirenkomik\.my\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('sirenkomik', 'SirenKomik', 'https://sirenkomik.my.id', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }

}