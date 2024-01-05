import { Tags } from '../Tags';
import icon from './HentaiHere.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const script = `
            new Promise((resolve, reject) => {
                    try {
                        resolve(rff_imageList.map(page => 'https://hentaicdn.com/hentai'+ page));
                    } catch(error) {
                        reject(error);
                    }
            });
        `;

@Common.MangaCSS(/^{origin}/, 'div.bg-black h4 a', Common.ElementLabelExtractor('span'))
@Common.MangasMultiPageCSS('/directory?page={page}', 'div.item a.text-ellipsis')
@Common.ChaptersSinglePageCSS('li.sub-chp a#chapterBlock', Common.AnchorInfoExtractor(false, 'i'))
@Common.PagesSinglePageJS(script, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaihere', `HentaiHere`, 'https://hentaihere.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}