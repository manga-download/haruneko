import { Tags } from '../Tags';
import icon from './ProjectSuki.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

const pageScript = `
    new Promise ((resolve, reject) => {
        try {

            const element = document.querySelector('.strip-reader');
            const bookid = window.location.href.split('/') [4];
            const chapterid = window.location.href.split('/') [5];
            const body = JSON.stringify({
                bookid: bookid,
                chapterid: chapterid,
                first: true
            });

            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const jsondata =  JSON.parse(xhr.response);

                    const images = [];
                    images.push(...[...document.querySelectorAll('img.img-fluid')].map(image => image.src));

                    const dom = new DOMParser().parseFromString(jsondata.src, 'text/html');
                    images.push(...[...dom.querySelectorAll('img.img-fluid')].map(image => image.src));
                    resolve(images);

                } else {
                    throw Error('Cant get images :/ !');
                }
            };
            xhr.open('POST', '/callpage');
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(body);

        } catch (error) {
            reject(error);
        }
    });

`;

type APIManga = {
    [id: number]: {
        value: string
    }
}

@Common.MangaCSS(/^{origin}\/book\/\d+$/, 'h2[itemprop="title"]')
@Common.ChaptersSinglePageCSS('table tr td a[href*="/read/"]')
@Common.PagesSinglePageJS(pageScript)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('projectsuki', 'Project Suki', 'https://projectsuki.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.English, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const data = await FetchWindowScript<APIManga>(new Request(new URL('/browse', this.URI)), 'titles');
        return Object.entries(data).map(([key, value]) => new Manga(this, provider, `/book/${key}`, value.value));
    }

}