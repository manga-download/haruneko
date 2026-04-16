import { Tags } from '../Tags';
import icon from './MangasBrasuka.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

export const pageScript = `
    new Promise(async (resolve, reject) => {
        try {
            const auth = new URL(document.querySelector('div.page-break a').href).searchParams.get('t');
            const response = await fetch('/campanha.php?auth=' + encodeURIComponent(auth));
            const body = new DOMParser().parseFromString((await response.text()), 'text/html');
            resolve([...body.querySelectorAll('div.manga-content img')].map(img => img.src));
        } catch (error) {
            reject(error)
        }
    })
`;

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasbrasuka', 'Mangas Brasuka', 'https://mangasbrasuka.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('wpmanga-adault', '1')`);
    }
}