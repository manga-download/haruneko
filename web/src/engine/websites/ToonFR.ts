import { Tags } from '../Tags';
import icon from './ToonFR.webp';
import { DecoratableMangaScraper, type Manga, type Chapter } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/webtoon\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type a')
@Madara.MangasMultiPageAJAX()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('toonfr', 'ToonFR', 'https://toonfr.com', Tags.Media.Manhwa, Tags.Language.French, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return Madara.FetchChaptersSinglePageAJAXv2.call(this, manga, undefined, (anchor: HTMLAnchorElement) => ({
            id: anchor.pathname,
            title: anchor.text.replace('- ' + manga.Title, '').trim(),
        }));
    }
}