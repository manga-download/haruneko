import { Tags } from '../Tags';
import icon from './PoseidonScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('poseidonscans', 'Poseidon Scans', 'https://poseidonscans.fr', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.French, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}