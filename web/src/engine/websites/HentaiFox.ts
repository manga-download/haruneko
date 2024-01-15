import { Tags } from '../Tags';
import icon from './HentaiFox.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `
    new Promise((resolve, reject) => {
        try {
            const dir = $('#load_dir').val();
            const id = $('#load_id').val();
            const images = Object.values(g_th).map((item, index) => {
                const file = (index + 1) + (item.startsWith('j') ? '.jpg' : '.png');
                return [ 'https://i.hentaifox.com', dir, id, file ].join('/');
            });
            resolve(images);
        } catch(error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\//, 'div.gallery_right div.info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(scriptPages, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('hentaifox', `HentaiFox`, 'https://hentaifox.com', Tags.Language.English, Tags.Media.Manga, Tags.Rating.Erotica, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
