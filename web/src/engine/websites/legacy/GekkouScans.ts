import { Tags } from '../../Tags';
import icon from './GekkouScans.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Madara from '../decorators/WordPressMadara';
import * as Common from '../decorators/Common';

@Madara.MangaCSS(/^https?:\/\/gekkou\.com\.br\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gekkouscans', `Gekkou Scans`, 'https://gekkou.com.br', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manga, Tags.Media.Manhwa);
    }

    public override get Icon() {
        return icon;
    }
}