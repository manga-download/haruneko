import { Tags } from '../Tags';
import icon from './FastestManga.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/[^/]+\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.ChaptersSinglePageAJAXv2()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('fastestmanga', 'Fastest Manga', 'https://www.fastestmanga.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Multilingual, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        return [
            ... await Madara.FetchMangasMultiPageCSS.call(this, provider, undefined, undefined, '/en/page/{page}/'),
            ... await Madara.FetchMangasMultiPageCSS.call(this, provider, undefined, undefined, '/tr/page/{page}/'),
            ... await Madara.FetchMangasMultiPageCSS.call(this, provider, undefined, undefined, '/ar/page/{page}/')
        ];
    }
}