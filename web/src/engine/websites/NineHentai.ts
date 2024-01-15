import { Tags } from '../Tags';
import icon from './NineHentai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchJSON, FetchWindowScript } from '../platform/FetchProvider';

const tokenScript = `
    new Promise((resolve, reject) => {
        const csrf = document.querySelector('meta[name="csrf-token"]').content.trim();
        const xsrf = document.cookie.match(/XSRF-TOKEN=([\\S]+)/)[1];
        resolve({csrf : csrf, xsrf : xsrf});
   });
`;

type JSONTokens = {
    csrf: string,
    xsrf : string
}

type APIChapter = {
    status: boolean,
    results: { total_page: number, id: number, image_server : string }
}

@Common.MangaCSS(/^{origin}\/g\//, 'div#info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('9hentai', `9hentai`, 'https://9hentai.to', Tags.Language.Multilingual, Tags.Rating.Erotica, Tags.Source.Aggregator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const chapterurl = new URL(chapter.Identifier, this.URI).href;
        //Get CSRF and XSRF tokens from meta tag and cookies
        const tokens = await FetchWindowScript<JSONTokens>(new Request(chapterurl), tokenScript, 500);

        //Now call the API
        const url = new URL('/api/getBookByID', this.URI).href;
        const mangaid = chapter.Identifier.match(/\/g\/([\d]+)/)[1];
        const body = JSON.stringify({ id: mangaid });
        const request = new Request(url, {
            method: 'POST', body: body, headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': this.URI.href,
                'Referer': new URL(chapter.Identifier, this.URI).href,
                'X-XSRF-TOKEN': tokens.xsrf,
                'X-CRSF-TOKEN': tokens.csrf
            }
        });
        const data = await FetchJSON<APIChapter>(request);
        return data.status ? [...new Array(data.results.total_page).keys()].map(page => {
            return new Page(this, chapter, new URL(data.results.image_server + data.results.id + '/' + (page + 1) + '.jpg'));
        }) : [];

    }
}