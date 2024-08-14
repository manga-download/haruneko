import { Tags } from '../Tags';
import icon from './ModeScanlator.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as HeamCMS from './decorators/HeanCMS';

const apiUrl = 'https://api.modescanlator.com';

@HeamCMS.MangaCSS(/^{origin}\/series\/[^/]+$/, apiUrl)
@HeamCMS.MangasMultiPageAJAX(apiUrl)
@HeamCMS.ChaptersSinglePageAJAXv2(apiUrl)
@HeamCMS.PagesSinglePageAJAX(apiUrl)
@HeamCMS.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('modescanlator', `Mode Scanlator`, 'https://site.modescanlator.com', Tags.Language.Portuguese, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator);
    }
    public override get Icon() {
        return icon;
    }
}