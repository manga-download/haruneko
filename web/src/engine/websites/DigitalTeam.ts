import { Tags } from '../Tags';
import icon from './DigitalTeam.webp';
import { type Chapter, DecoratableMangaScraper, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Grouple from './decorators/Grouple';
import { FetchJSON } from '../platform/FetchProvider';

type APIResult = [
    [{ name: string, ex: string }],
    string[],
    string
];

@Common.MangaCSS(/^{origin}\/[^/]+/, 'div#manga_right div.title')
@Common.MangasSinglePageCSS('/reader/series', 'div#series_list ul li.manga_block ul li.manga_info div.manga_title a')
@Common.ChaptersSinglePageCSS('div.chapter_list ul li div.ch_top a')
@Grouple.ImageWithMirrors()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('digitalteam', `DigitalTeam`, 'https://dgtread.com', Tags.Language.Italian, Tags.Media.Manga, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        //First : fetch page html
        //const doc = await FetchHTML(new Request(new URL(chapter.Identifier, this.URI)));
        //const external = doc.documentElement.innerHTML.includes('js/jq_rext.js');

        let data = await FetchJSON<APIResult>(new Request(new URL('/reader/c_i', this.URI), {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                'info[manga]': chapter.Parent.Identifier.split('/').at(-1),
                'info[chapter]': chapter.Identifier.split('/').slice(-2)[0],
                'info[ch_sub]': '0',
                'info[title]': 'Digital Team'
            })
        }));
        data = typeof data === 'string' ? JSON.parse(data) : data;

        const [images, paths, altpath] = data;
        return images.map(({ name, ex }, index) => new Page(this, chapter, new URL(`${paths[index]}${name}${ex}`, this.URI), { mirrors: [new URL(`/reader${altpath}${name}${paths[index]}${ex}`, this.URI).href] }));
    }
}