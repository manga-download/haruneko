import { Tags } from '../Tags';
import icon from './ComicPolaris.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as SpeedBinb from './decorators/SpeedBinb';
import { FetchCSS } from '../platform/FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('img').getAttribute('alt').trim()
    };
}

@Common.MangaCSS(/^{origin}\/[^/]+\/$/, 'div#contents div.h2_area_comic h2.h2ttl_comic')
@Common.MangasMultiPageCSS('/wp-admin/admin-ajax.php?action=get_flex_titles_for_toppage&get_num=64&page={page}', 'div.update_work_size div.update_work_info_img a', 1, 1, 0, MangaExtractor)
@SpeedBinb.PagesSinglePageAjaxV016061()
@SpeedBinb.ImageAjax()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicpolaris', `COMICポラリス (COMIC Polaris)`, 'https://comic-polaris.jp', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const [ data ] = await FetchCSS(new Request(new URL(manga.Identifier, this.URI)), 'div#contents');

        let chapterList = [...data.querySelectorAll<HTMLAnchorElement>('div.work_episode div.work_episode_box div.work_episode_table div.work_episode_link_btn a')]
            .map(element => new Chapter(this, manga, element.pathname, element.closest('div.work_episode_table').querySelector<HTMLDivElement>('div.work_episode_txt').innerText.replace(manga.Title, '').trim()));

        if (chapterList.length == 0) {
            chapterList = [...data.querySelectorAll<HTMLAnchorElement>('div.latest_info_box div.latest_info_link_btn01 a')]
                .map(element => new Chapter(this, manga, element.pathname, element.text.replace('読む', '').trim()));
        }
        return chapterList;
    }

}