import { Tags } from '../Tags';
import icon from './GuruKomik.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

const scriptChapterList = `
    [...document.querySelectorAll('div#episodeNime ul li div.eph-num a:last-of-type')].map(anchor => {
        return {
            id: anchor.pathname,
            title: anchor.querySelector('span.chapternum').textContent
        };
    });
`;

@MangaStream.MangaCSS(/^{origin}\/[0-9]{4}\/[0-9]{2}\/[^/]+$/, 'meta[property="og:description"]')
@Common.MangasNotSupported()
@Common.ChaptersSinglePageJS(scriptChapterList, 2500)
@MangaStream.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('gurukomik', 'Guru Komik', 'https://gurukomiklive.blogspot.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}