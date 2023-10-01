import { Tags } from '../Tags';
import icon from './Cmoa.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../FetchProvider';
function MangaLabelExtractor(body: HTMLBodyElement) {
    const title = body.querySelector('#GA_this_page_title_name').textContent.trim();
    return title;
}

@Common.MangaCSS(/^https?:\/\/www\.cmoa\.jp\/title\/\d+\/$/, 'body', MangaLabelExtractor)
@Common.MangasNotSupported()
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('cmoa', `コミックシーモア (Cmoa)`, 'https://www.cmoa.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL(manga.Identifier, this.URI).href);
        const pages = await FetchCSS(request, '#comic_list > .pagination:nth-child(1) li');
        const chapters = [];
        const totalPage = pages.length == 0 ? 1 : pages.length - 1;
        for (let i = 0; i < totalPage; i++) {
            const uri = new URL(manga.Identifier, this.URI);
            uri.searchParams.set('page', String(i + 1));
            const pageRequest = new FetchRequest(uri.href);
            const data = await FetchCSS(pageRequest, '.title_vol_vox_vols .title_vol_vox_vols_i');
            for (const element of data) {
                const chapterLink = element.querySelector<HTMLAnchorElement>('a[href^="/reader/"]');
                if (!chapterLink) {
                    continue;
                }
                const chapterUrl = new URL(chapterLink.href, this.URI);
                const id = chapterUrl.searchParams.get('content_id');
                const u0 = chapterUrl.pathname.startsWith('/reader/sample') ? 1 : 0;
                const title = element.querySelector('.title_details_title_name_h2').textContent.trim();
                chapters.push(new Chapter(this, manga, `/bib/speedreader/?cid=${id.slice(1, 11)}_jp_${id.slice(11, 15)}&u0=${u0}&u1=0`, title.replace('NEW\n', '').trim()));
            }
        }
        return chapters;
    }
}