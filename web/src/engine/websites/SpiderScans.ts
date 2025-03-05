import { Tags } from '../Tags';
import icon from './SpiderScans.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(undefined, true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('spiderscans', 'Spider Scans', 'https://spiderscans.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL(this.URI)), `window.cookieStore.set('wpmanga-adult', '1')`);
    }

}