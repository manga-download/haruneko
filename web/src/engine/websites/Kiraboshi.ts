import { Tags } from '../Tags';
import icon from './Kiraboshi.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchHTML, FetchJSON } from '../platform/FetchProvider';

type APIMangas = {
    data: {
        url: string;
        name: string;
    }[]
};

@Common.MangaCSS(/^{origin}\/[^/]+\/titles\/[^/]+$/, 'div.breadcrumb ul li:last-of-type')
@Common.ChaptersSinglePageCSS('div.episode-item:has(a)', undefined, element =>
    ({ id: element.querySelector<HTMLAnchorElement>('a').pathname, title: element.querySelector<HTMLDivElement>('div.episode-item-left').textContent.trim() }))
@SpeedBinb.PagesSinglePageAjax()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('kiraboshi', 'Kiraboshi', 'https://kirapo.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const doc = await FetchHTML(new Request(new URL('./titles', this.URI)));
        const mangaList = [...doc.querySelectorAll<HTMLAnchorElement>('div#titles-container a')].map(manga => {
            return new Manga(this, provider, manga.pathname, manga.querySelector<HTMLImageElement>('img').alt.trim());
        });

        const readAt = doc.querySelector<HTMLAnchorElement>('a#more_titles_button').dataset.readAt;
        const { data } = await FetchJSON<APIMangas>(new Request(new URL(`./title-list?read_at=${readAt}`, 'https://kirapo.jp/api/')));
        return mangaList.concat(...data.map(({ url, name }) => new Manga(this, provider, new URL(url, this.URI).pathname, name)));
    }
}