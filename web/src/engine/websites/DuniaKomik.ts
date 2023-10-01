import { Tags } from '../Tags';
import icon from './DuniaKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/duniakomik\.org\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gabutscans', 'Dunia Komik', 'https://duniakomik.org', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}