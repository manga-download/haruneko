import { Tags } from '../Tags';
import icon from './MangaRuhu.webp';
import { InitManga } from './templates/InitManga';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ul.uk-breadcrumb li:last-of-type')
@Common.MangasMultiPageCSS('div.manga-item-grid h2 a.uk-link-heading', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ImageAjax()
export default class extends InitManga {

    public constructor() {
        super('mangaruhu', 'MangaRuhu', 'https://mangaruhu.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Scanlator, Tags.Language.English);
    }

    public override get Icon() {
        return icon;
    }
}