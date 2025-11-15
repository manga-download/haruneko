import { Tags } from '../Tags';
import icon from './HadesNoFansub.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/tmo\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hadesnofansub', 'Hades No Fansub', 'https://lectorhades.latamtoon.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(new URL(this.URI)), `window.cookieStore.set('wpmanga-adult', '1')`);
    }
}