import { Tags } from '../Tags';
import icon from './MangaSect.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchRequest } from '../FetchProvider';
import DeProxify from '../transformers/ImageLinkDeProxifier';

type AJAXResponse = {
    html: string;
}

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/\d+$/, 'article header h1')
@Common.MangasMultiPageCSS('/all-manga/{page}/', 'div.grid div.text-center > a')
@Common.ChaptersSinglePageCSS('li.chapter > a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangasect', 'MangaSect', 'https://mangasect.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {

        const chapterid = chapter.Identifier.match(/\/([\d]+)$/)[1];
        const request = new FetchRequest(new URL(`/ajax/image/list/chap/${chapterid}`, this.URI).href, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                Referer: new URL(chapter.Identifier, this.URI).href
            }
        });

        const response = await FetchJSON<AJAXResponse>(request);
        const dom = new DOMParser().parseFromString(response.html, 'text/html');
        let data = [...dom.querySelectorAll<HTMLImageElement>('a.readimg img.lazy.loaded')];
        data = data.sort(function (a, b) {
            const za = parseInt(a.parentElement.parentElement.dataset.index);
            const zy = parseInt(b.parentElement.parentElement.dataset.index);
            return za - zy;
        });
        return data.map(image => new Page(this, chapter, DeProxify(new URL(image.getAttribute('src')))));

    }

}