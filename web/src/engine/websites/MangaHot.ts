import { Tags } from '../Tags';
import icon from './MangaHot.webp';
import { Chapter, DecoratableMangaScraper, Manga, type MangaPlugin, Page } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchCSS, FetchJSON, } from '../platform/FetchProvider';
import type { Priority } from '../taskpool/DeferredTask';
import DeScramble from '../transformers/ImageDescrambler';

type APIResult<T> = {
    result: null | T
}

type PageResult = {
    [id: string]: string
}

function MangaExtractor(element: HTMLAnchorElement) {
    return {
        id: new URL(element.href).searchParams.get('work_code'),
        title: element.querySelector('div.work_name').textContent.trim()
    };

}

@Common.MangasSinglePageCSS('/ranking', 'div.ranking a.parent', MangaExtractor)

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangahot', 'マンガほっと (Manga Hot)', 'https://web.mangahot.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        const uri = new URL(url);
        return uri.origin === this.URI.origin && uri.pathname === '/works/detail.php' && uri.searchParams.has('work_code');
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const [data] = await FetchCSS(new Request(url), 'div.work_base div.work_name');
        return new Manga(this, provider, new URL(url).searchParams.get('work_code'), data.textContent.trim());
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const url = new URL(`/works/detail.php`, this.URI);
        url.search = new URLSearchParams({
            work_code: manga.Identifier,
            mode: 'ajax_stories',
            _: Date.now().toString()
        }).toString();

        const { result } = await FetchJSON<APIResult<string>>(new Request(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
            }
        }));

        const dom = new DOMParser().parseFromString(result, 'text/html');
        const nodes = [...dom.querySelectorAll<HTMLAnchorElement>('a[id].parent')];
        return nodes.map(node => {
            const chapterid = new URL(node.href, this.URI).searchParams.get('story_id') ?? node.href.match(/dialog\('(\d+)'\)/)[1];
            return new Chapter(this, manga, chapterid, node.querySelector('div.episode_name').textContent.trim());
        });
    }

    public override async FetchPages(chapter: Chapter): Promise<Page[]> {
        const pageList: Page[] = [];
        for (let page = 1, run = true; run; page++) {//there is ONE request per page despites the api returning a couple of page. This is beyond stupid.
            const url = new URL(`/works/fls.php`, this.URI);
            const request = new Request(url, {
                method: 'POST',
                body: `story_id=${chapter.Identifier}&page_no=${page}`,
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
                }
            });

            const { result } = await FetchJSON<APIResult<string[] | PageResult>>(request); //result can be an array or a json object list
            if(!result || Object.keys(result).length === 0) {
                run = false;
                continue;
            }

            for (const key of Object.keys(result)) { //works with array and object list
                const page = new Page(this, chapter, new URL(`/app_img${window.atob(result[key])}`, this.URI));
                if (!pageList.find(element => element.Link.href === page.Link.href)) {
                    pageList.push(page);
                }
            }
        }
        return pageList;
    }

    public override async FetchImage(page: Page, priority: Priority, signal: AbortSignal): Promise<Blob> {
        const blob = await Common.FetchImageAjax.call(this, page, priority, signal);
        const scrambletype = this.GetScrambleType(page.Link.href);
        return DeScramble(blob, async (image, ctx) => {

            const CELL_SIZE = 50;
            const iWidth = image.width;
            const iHeight = image.height;
            const x_num = Math.floor(iWidth / CELL_SIZE);
            const x_rem = Math.floor(iWidth % CELL_SIZE);
            const y_num = Math.floor(iHeight / CELL_SIZE);
            const y_rem = Math.floor(iHeight % CELL_SIZE);
            let puzzleData = InitPotList();
            puzzleData = scrambletype == 1 ? GetPuzzleColData(GetPuzzleRowData(puzzleData)) : GetPuzzleRowData(GetPuzzleColData(puzzleData));

            //***********************************************/
            //DRAW
            //************************************************/
            for (let i = 0; i < puzzleData.length; i++)
                for (let r = puzzleData[i], e = 0; e < r.length; e++)
                    ctx.drawImage(image, r[e][0], r[e][1], CELL_SIZE, CELL_SIZE, e * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);

            if (0 < y_rem)
                for (let e = 0; e < x_num; e++)
                    ctx.drawImage(image, e * CELL_SIZE, y_num * CELL_SIZE, CELL_SIZE, y_rem, e * CELL_SIZE, y_num * CELL_SIZE, CELL_SIZE, y_rem);

            if (0 < x_rem)
                for (let i = 0; i < y_num; i++) ctx.drawImage(
                    image, x_num * CELL_SIZE, i * CELL_SIZE, x_rem, CELL_SIZE, x_num * CELL_SIZE, i * CELL_SIZE, x_rem, CELL_SIZE);

            0 < y_rem && 0 < x_rem && ctx.drawImage(image, x_num * CELL_SIZE, y_num * CELL_SIZE, x_rem, y_rem, x_num * CELL_SIZE, y_num * CELL_SIZE, x_rem, y_rem);

            function InitPotList(): Array<Array<number>> {
                let t = 0, i = 0;
                const r = [];
                for (let e = 0; e < y_num; e++) {
                    const a = [];
                    for (let s = 0; s < x_num; s++) {
                        a.push([t, i]);
                        t += CELL_SIZE;
                    }
                    t = 0;
                    i += CELL_SIZE;
                    r.push(a);
                }
                return r;
            }

            function GetPuzzleRowData(t: Array<Array<number>>, useYnum: boolean = false): Array<Array<number>> {
                const r = useYnum ? y_num : x_num;
                const e: Array<Array<number>> = [];
                let a = - 1;
                for (let s = 0; s < t.length; s++) {
                    const h = t[s];
                    const _ = s + 1;
                    const n = new Array(r);
                    for (let o = 0; o < h.length; o++) {
                        let L = o + a * _;
                        for (; r <= L;) L -= r;
                        for (; L < 0;) L += r;
                        n[L] = h[o];
                    }
                    a = - a;
                    e.push(n);
                }
                return e;
            }

            function GetPuzzleColData(t: Array<Array<number>>): Array<Array<number>> {
                const i = new Array(x_num);
                for (let r = 0; r < y_num; r++) {
                    for (let e = 0; e < x_num; e++) {
                        Array.isArray(i[e]) || (i[e] = new Array(y_num)), i[e][r] = t[r][e];
                    }
                }
                const puzzle_col_data = GetPuzzleRowData(i, true);
                const restored_images: Array<Array<number>> = new Array(y_num);

                for (let r = 0; r < x_num; r++) {
                    for (let e = 0; e < y_num; e++) {
                        Array.isArray(restored_images[e]) || (restored_images[e] = new Array(x_num)), restored_images[e][r] = puzzle_col_data[r][e];
                    }
                }
                return restored_images;
            }
        });
    }

    GetScrambleType(href: string): number {
        let t = 0;
        href = href.split('/').pop();
        const ptn: RegExp = /^[0-9]$/;
        for (let i = 0; i < href.length; i++) {
            ptn.test(href[i]) && (t += parseInt(href[i]));
        }
        return t % 2 == 1 ? 1 : 2;
    }
}
