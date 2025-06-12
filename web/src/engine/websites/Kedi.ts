import { Tags } from '../Tags';
import icon from './Kedi.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title h1')
@Common.MangasMultiPageCSS('/seriler/page/{page}/', 'div.manga div.post-title h3 a')
@Common.ChaptersSinglePageCSS('ul li.wp-manga-chapter a')
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kedi', 'Kedi Manga', 'https://kedi.to', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Turkish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}