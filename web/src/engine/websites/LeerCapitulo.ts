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
            'EzCIUe3plcrfxuv9hKOsVtkTA6ZjaXRQJ0wWqb5D8gm1nG7LoH2dFyNYB4PiMS'[
              'xXHbvV7snRpMFkrUPqlS4BzG3jg1aYC5WJ0wcZiLtoAyedQ8D2fTNOI9Eu6mhK'.indexOf(
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
            const mangas = await Common.FetchMangasMultiPageCSS.call(this, provider, 'div.media div.media-body a', Common.PatternLinkGenerator(`/status/${category}/?page={page}`));
            mangaList.push(...mangas);
        }
        return mangaList.distinct();
    }
}