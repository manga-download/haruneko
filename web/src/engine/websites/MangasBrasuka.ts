import { Tags } from '../Tags';
import icon from './MangasBrasuka.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

@Madara.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'ol.breadcrumb li:last-of-type')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv2()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor(...args: [] | ConstructorParameters<typeof DecoratableMangaScraper>) {
        if (args.length) {
            super(...args as ConstructorParameters<typeof DecoratableMangaScraper>);
        } else {
            super('mangasbrasuka', 'Mangas Brasuka', 'https://mangasbrasuka.com.br', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Accessibility.RegionLocked);
        }
    }

    public override get Icon() {
        return icon;
    }

    public override async Initialize(): Promise<void> {
        return FetchWindowScript(new Request(this.URI), `window.cookieStore.set('wpmanga-adault', '1')`);
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const images = await FetchWindowScript<string[]>(new Request(new URL(chapter.Identifier, this.URI)), `
            new Promise(async (resolve, reject) => {
                try {
                    const auth = new URL(document.querySelector('div.page-break a').href).searchParams.get('a');
                    const response = await fetch('/campanha.php?auth=' + encodeURIComponent(auth));
                    const body = new DOMParser().parseFromString((await response.text()), 'text/html');
                    resolve([...body.querySelectorAll('div.manga-content img')].map(img => img.src));
                } catch (error) {
                    reject(error)
                }
            })
        `);
        return images.map(image => new Page(this, chapter, new URL(image, this.URI), { Referer: this.URI.href }));
    }
}