import { Tags } from '../Tags';
import icon from './PijamaliKoi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/pijamalikoi\.com\/m\/seri\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS(undefined, '/m/manga/list-mode/')
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageJS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('pijamalikoi', 'Pijamalı Koi', 'https://pijamalikoi.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}