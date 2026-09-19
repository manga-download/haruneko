import { Tags } from '../Tags';
import icon from './RitharScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as KeyoApp from './templates/KeyoApp';

@Common.MangaCSS(/^{origin}\/series\/[^/]+$/, 'div.grid h1.capitalize')
@Common.MangasSinglePageCSS('/latest', 'div.grid a.grid', Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS(KeyoApp.queryChapters, undefined, Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(`JSON.parse(JSON.stringify( Alpine.$data(document.querySelector('[x-data*="immersiveReader"]')))).pages.map(page=> page.path);`, 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('ritharscans', 'Rithar Scans', 'https://ritharscans.com', Tags.Media.Manga, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}