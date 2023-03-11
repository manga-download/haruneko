import { Tags } from '../Tags';
import icon from './NineHentai.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, FetchRequest } from '../FetchProvider';

type APIChapter = {
    status: boolean,
    results: { total_page: number, id: number, image_server : string }
}

@Common.MangaCSS(/^https?:\/\/9hentai\.to\/g\//, 'div#info h1')
@Common.MangasNotSupported()
@Common.ChaptersUniqueFromManga()
@Common.ImageDirect()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('9hentai', `9hentai`, 'https://9hentai.to', Tags.Language.Multilingual, Tags.Rating.Erotica, Tags.Source.Aggregator, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //First get CSRF token
        const csrf = (await FetchCSS<HTMLMetaElement>(new FetchRequest(new URL(chapter.Identifier, this.URI).href), 'meta[name="csrf-token"]')).shift().content.trim();
        // then get XSRFtoken from cookies
        const XSRFtoken = await (await chrome.cookies.getAll({ url: this.URI.href })).find(cookie => cookie.name == 'XSRF-TOKEN').value;
        //Now call the API
        const url = new URL('/api/getBookByID', this.URI).href;
        const mangaid = chapter.Identifier.match(/\/g\/([\d]+)/)[1];
        const body = JSON.stringify({ id: mangaid });
        const request = new FetchRequest(url, {
            method: 'POST', body: body, headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'X-Requested-With': 'XMLHttpRequest',
                'Origin': this.URI.href,
                'Referer': new URL(chapter.Identifier, this.URI).href,
                'X-XSRF-TOKEN': XSRFtoken,
                'X-CRSF-TOKEN': csrf
            }
        });
        const data = await FetchJSON<APIChapter>(request);
        return data.status ? [...new Array(data.results.total_page).keys()].map(page => {
            return new Page(this, chapter, new URL(data.results.image_server + data.results.id + '/' + (page + 1) + '.jpg'));
        }) : [];

    }
}