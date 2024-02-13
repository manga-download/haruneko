import { Tags } from '../Tags';
import icon from './DigitalTeam.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { Fetch, FetchJSON } from '../platform/FetchProvider';

type APIResult = [
    [{ name: string, ex: string }],
    string[],
    string
];

@Common.MangaCSS(/^{origin}\/[^/]+/, 'div#manga_right div.title')
@Common.MangasSinglePageCSS('/reader/series', 'div#series_list ul li.manga_block ul li.manga_info div.manga_title a')
@Common.ChaptersSinglePageCSS('div.chapter_list ul li div.ch_top a')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('digitalteam', `DigitalTeam`, 'https://dgtread.com', Tags.Language.Italian, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //First : fetch page
        let uri = new URL(chapter.Identifier, this.URI);
        let request = new Request(uri.href);
        const response = await Fetch(request);
        const dat = await response.text();
        const external = dat.includes('js/jq_rext.js');

        uri = new URL('/reader/c_i', this.URI);
        request = new Request(uri.href, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                'info[manga]': chapter.Parent.Identifier.split('/').pop(),
                'info[chapter]': chapter.Identifier.split('/').slice(-2)[0],
                'info[ch_sub]': '0',
                'info[title]': 'Digital Team'
            })
        });
        let data = await FetchJSON<APIResult>(request);
        data = typeof data === 'string' ? JSON.parse(data) : data;
        return data[0].map((file, index) => {
            if (external) {
                return new Page(this, chapter, new URL(data[1][index] + file.name + file.ex, this.URI));
            } else {
                return new Page(this, chapter, new URL('/reader' + data[2] + file.name + data[1][index] + file.ex, this.URI));
            }
        });
    }
}