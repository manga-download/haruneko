import { Tags } from '../Tags';
import icon from './Akuma.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(async (resolve, reject) => {
        try {
            const imageCDN = document.querySelector('.entry-cover .img-thumbnail').src.split('/').toSpliced(-1, 1, '').join('/');
            const response = await fetch(window.location.href, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content.trim(),
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            const data = await response.json();
            resolve(data.map(image => imageCDN + image));
        } catch(error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/g\/[^/]+$/, 'h1.entry-title')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('akuma', 'Akuma.moe', 'https://akuma.moe', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Multilingual, Tags.Source.Aggregator, Tags.Rating.Pornographic);
    }

    public override get Icon() {
        return icon;
    }
}