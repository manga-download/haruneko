import { Tags } from '../Tags';
import icon from './HentaiHere.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const script = `
    new Promise( resolve => {
        resolve(rff_imageList.map(page => 'https://hentaicdn.com/hentai'+ page));
    });
`;

@Common.MangaCSS(/^{origin}\/m\/[^/]+$/, 'div.bg-black h4 a', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/directory?page={page}', 'div.item a.text-ellipsis')
@Common.PagesSinglePageJS(script, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaihere', `HentaiHere`, 'https://hentaihere.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const chapters = await Common.FetchChaptersSinglePageCSS.call(this, manga, 'li.sub-chp a#chapterBlock', Common.AnchorInfoExtractor(false, 'i'));
        return chapters.map(chapter => new Chapter(this, manga, chapter.Identifier, chapter.Title.replace(/-$/, '').trim()));
    }
}
