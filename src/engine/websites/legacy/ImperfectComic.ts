import { Tags } from '../../Tags';
import icon from './ImperfectComic.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
//import * as MangaStream from './decorators/WordPressMangaStream';
//import * as Common from './decorators/Common';

// TODO: Changed template to WordPress MangaStream
/*
@MangaStream.MangaCSS(/^https?:\/\/imperfectcomic\.com\/manga\/[^/]+\/$/)
@MangaStream.MangasMultiPageAJAX()
@MangaStream.ChaptersSinglePageAJAXv1()
@MangaStream.PagesSinglePageCSS()
@Common.ImageDirect()
*/
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imperfectcomic', 'Imperfect Comic', 'https://imperfectcomic.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}