import { Tags } from '../Tags';
import icon from './Cmoa.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';
import { SpeedBindVersion } from './decorators/SpeedBinb';

@Common.MangaCSS(/^{origin}\/title\/\d+\/$/, '#GA_this_page_title_name')
@Common.MangasNotSupported()
@SpeedBinb.PagesSinglePageAjax(SpeedBindVersion.v016452)
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('cmoa', `コミックシーモア (Cmoa)`, 'https://www.cmoa.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const pages = await FetchCSS<HTMLAnchorElement>(new Request(new URL(manga.Identifier, this.URI).href), '#comic_list > .pagination:nth-child(1) li:nth-last-child(2) a');
        const totalPage = pages.length == 0 ? 1 : parseInt(new URL(pages[0].href).searchParams.get('page'));
        type This = typeof this;
        return (await Array.fromAsync(async function* (this: This) {
            for (let page = 0; page < totalPage; page++) {
                const data = await FetchCSS(new Request(new URL(`${manga.Identifier}?page=${page + 1}`, this.URI)), '.title_vol_vox_vols .title_vol_vox_vols_i');
                const chapters = data.map(element => {
                    const chapterLink = element.querySelector<HTMLAnchorElement>('a[href^="/reader/"]');
                    if (!chapterLink) return null;
                    const chapterUrl = new URL(chapterLink.href, this.URI);
                    const id = chapterUrl.searchParams.get('content_id');
                    const u0 = chapterUrl.pathname.startsWith('/reader/sample') ? 1 : 0;
                    const title = element.querySelector('.title_details_title_name_h2').textContent.trim();
                    return new Chapter(this, manga, `/bib/speedreader/?cid=${id.slice(1, 11)}_jp_${id.slice(11, 15)}&u0=${u0}&u1=0`, title.replace('NEW\n', '').trim());
                });
                yield* chapters;
            }
        }.call(this))).filter(chapter => chapter);
    }
}