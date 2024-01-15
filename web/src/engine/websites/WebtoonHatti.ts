import { Tags } from '../Tags';
import icon from './WebtoonHatti.webp';
import { type Chapter, DecoratableMangaScraper, type Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/)
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('webtoonhatti', 'Webtoon Hatti', 'https://webtoonhatti.com', Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Language.Turkish, Tags.Source.Aggregator, Tags.Accessibility.RegionLocked);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        const excludes = [
            /tr2.png$/i,
            /b2.jpg$/i,
            /romantiktr\.tr/i
        ];
        return (await Madara.FetchPagesSinglePageCSS.call(this, chapter)).filter(page => !excludes.some(rgx => rgx.test(page.Link.href)));
    }
}