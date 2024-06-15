import { Tags } from '../Tags';
import icon from './LeerCapitulo.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise(resolve => {
        const data = document.querySelector('p#array_data').textContent.trim();
        resolve(atob(data.replace(
          /[A-Z0-9]/gi,
          (a) =>
            'gHjXYh8PzLNGEJ4cbCWrkuM7dDZBnKlqxU0AT9OSfaV3o5iw6I2esmF1vQpRty'[
              'QxtrwfTIpl5cOyDgEH4zbZ3LK0e8GSsNq2AWJVm1ikoRa6C7jUYPFXuv9nBdMh'.indexOf(
                a
              )
            ]
        )).split(','));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/[^/]+\/$/, 'div.media-body .title-manga')
@Common.ChaptersSinglePageCSS('div.chapter-list ul li h4 a')
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('leercapitulo', 'LeerCapitulo', 'https://www.leercapitulo.co', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `localStorage.setItem('display_mode', '1')`, 1500);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const categories = ['completed', 'ongoing', 'paused', 'cancelled'];
        const mangaList: Manga[] = [];
        for (const category of categories) {
            const path = `/status/${category}/?page={page}`;
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, path, 'div.media div.media-body a');
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }
}