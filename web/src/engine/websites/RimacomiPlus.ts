import { Tags } from '../Tags';
import icon from './RimacomiPlus.webp';
import { ComiciViewer } from './templates/ComiciViewer';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}(\/[^/]+)?\/series\/[^/]+$/, 'h1.series-h-title', Common.WebsiteInfoExtractor({ queryBloat: 'span' }))
export default class extends ComiciViewer {

    public constructor() {
        super('rimacomiplus', 'RimacomiPlus (リマコミ＋)', 'https://rimacomiplus.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}