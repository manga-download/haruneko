import { Tags } from '../Tags';
import icon from './AsmHentai.webp';
import { DecoratableMangaScraper, Chapter, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaStream from './decorators/WordPressMangaStream';

const script = `
            new Promise((resolve, reject) => {
                    try {
                        const pages = parseInt($("#t_pages").val());
                        const dir = $("#load_dir").val();
                        const id = $("#load_id").val();
                        const images = [...new Array(pages)].map((_, index) => {
                            const file = (index + 1) + '.jpg';
                            return [ 'https://images.asmhentai.com', dir, id, file ].join('/');
                        });
                        resolve(images);
                    } catch(error) {
                        reject(error);
                    }
            });
        `;

@Common.MangaCSS(/^https?:\/\/asmhentai\.com\/g\/[^/]+\/$/, 'div.book_page div.info h1')
@Common.MangasNotSupported()
@MangaStream.PagesSinglePageJS([], script)
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('asmhentai', `AsmHentai`, 'https://asmhentai.com', Tags.Language.Multilingual, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }
}
