import { Tags } from '../Tags';
import icon from './HentaiFox.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `
    new Promise((resolve, reject) => {
        try {
            const extensions = { p: '.png', b: '.bmp', g: '.gif', w: '.webp' };
            const dir = $('#load_dir').val();
            const id = $('#load_id').val();
            const images = Object.values(g_th).map((item, index) => {
                const file = (index + 1) + (extensions[item[0]] ?? '.jpg');
                return [ 'https://i.hentaifox.com', dir, id, file ].join('/');
            });
            resolve(images);
        } catch(error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/gallery\/\d+\/$/, 'div.gallery_right div.info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(scriptPages, 3500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaifox', `HentaiFox`, 'https://hentaifox.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Pornographic, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
