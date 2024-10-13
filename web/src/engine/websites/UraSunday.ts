import { Tags } from '../Tags';
import icon from './UraSunday.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
     pages.filter(page => page.src).map(page => page.src);
`;

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector<HTMLImageElement>('img').alt.replace('作品サムネイル', '').replace(/「/, '').replace('」', '').trim();
    return { id, title };
}

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const subdiv = anchor.querySelector('div');
    let bloat = subdiv.querySelector('div[class]');

    while (bloat) {
        subdiv.removeChild(bloat);
        bloat = subdiv.querySelector('div[class]');
    }

    let title = anchor.querySelector('div > div:first-of-type').textContent.trim();
    title += anchor.querySelector('div > div:nth-of-type(2)').textContent ? ' - ' + anchor.querySelector('div > div:nth-of-type(2)').textContent.trim() : '';
    return {
        id: anchor.pathname,
        title: title
    };
}

@Common.MangaCSS(/^{origin}\/title\/\d+$/, 'div.title div.detail div.info h1')
@Common.ChaptersSinglePageCSS('div.title div.detail div.chapter ul li:not([class]) a', ChapterExtractor)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('urasunday', `裏サンデー (Ura Sunday)`, 'https://urasunday.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangaList: Manga[] = [];
        for (const page of ['/serial_title', '/complete_title']) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, page, 'div.title-all-list ul li a', MangaExtractor);
            mangaList.push(...mangas);
        }
        return mangaList;
    }
}