import { Tags } from '../Tags';
import icon from './IMHentai.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const script = `
            new Promise((resolve, reject) => {
                    try {
                        const extensions = [ '.jpg', '.png', '.gif', '.webp' ];
                        const server = $('#load_server').val();
                        const dir = $('#load_dir').val();
                        const id = $('#load_id').val();
                        const images = Object.values(g_th).map((item, index) => {
                            const file = (index + 1) + extensions.find(ext => ext[1] === item[0]);
                            return [ 'https://m' + server + '.' + window.location.hostname, dir, id, file ].join('/');
                        });
                        resolve(images);
                    } catch(error) {
                        reject(error);
                    }
            });
`;

@Common.MangaCSS(/^https?:\/\/imhentai\.xxx/, 'div.right_details h1')
@Common.MangasNotSupported()
@Common.PagesSinglePageJS(script, 2500)
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('imhentai', `IMHentai`, 'https://imhentai.xxx', Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        return [new Chapter(this, manga, manga.Identifier, manga.Title)];
    }
}