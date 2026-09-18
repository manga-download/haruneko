import { Tags } from '../Tags';
import icon from './ProjectSuki.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type APIManga = {
    [id: number]: {
        value: string;
    };
};

@Common.MangaCSS(/^{origin}\/book\/\d+$/, 'h2[itemprop="title"]')
@Common.ChaptersSinglePageCSS('table tr td a[href*="/read/"]')
@Common.PagesSinglePageJS(`
    new Promise (async (resolve, reject) => {
        try {
            const [, , , , bookid, chapterid ] = window.location.href.split('/');
            const body = JSON.stringify({ bookid, chapterid, first: true });

            const response = await fetch(window.location.origin + '/callpage', {
                headers: {
                    'Content-Type': 'application/json;charset=UTF-8',
                },
                body: body,
                method: 'POST',
            });
            const data = await response.json();

            //get first images
            let images = [...document.querySelectorAll('div.strip-reader img.img-fluid')].map(image => image.src);

            //get images from request
            const dom = new DOMParser().parseFromString(data.src, 'text/html');
            images = images.concat([...dom.querySelectorAll('img.img-fluid')].map(image => image.src));

            resolve(images);

        } catch (error) {
            reject(error);
        }
    });`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('projectsuki', 'Project Suki', 'https://projectsuki.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<APIManga>(new Request(new URL('/browse', this.URI)), 'titles', 500);
        return Object.entries(data).map(([key, { value }]) => new Manga(this, provider, `/book/${key}`, value));
    }
}