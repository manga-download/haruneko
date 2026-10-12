import { Tags } from '../Tags';
import icon from './AsmHentai.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/g\/[^/]+\/$/, 'div.book_page div.info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(`
    new Promise((resolve, reject) => {
        const pages = parseInt($('#t_pages').val());
        const dir = $('#load_dir').val();
        const id = $('#load_id').val();
        const images = [...new Array(pages)].map((_, index) => {
            const file = (index + 1) + '.jpg';
            return [ 'https://images.asmhentai.com', dir, id, file ].join('/');
        });
        resolve(images);
    });
`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asmhentai', `AsmHentai`, 'https://asmhentai.com', Tags.Media.Manga, Tags.Language.Multilingual, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}