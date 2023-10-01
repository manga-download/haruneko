import { Tags } from '../../Tags';
import icon from './ComicMeteor.webp';
import { Chapter, DecoratableMangaScraper, type Manga } from '../../providers/MangaPlugin';
import * as Common from '../decorators/Common';
import * as SpeedBinb from '../decorators/SpeedBinb';
import { FetchCSS, FetchRequest } from '../../FetchProvider';

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('img').getAttribute('alt').trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/comic-meteor\.jp\/\S+\/$/, 'div.h2ttl_other')
@Common.MangasMultiPageCSS('/wp-admin/admin-ajax.php?action=get_flex_titles_for_toppage&get_num=64&page={page}', 'div.update_work_size div.update_work_info_img a', 1, 1, 0, MangaExtractor)
@SpeedBinb.PagesSinglePage()
@SpeedBinb.ImageDescrambler()
export default class extends DecoratableMangaScraper {
    public constructor() {
        super('comicmeteor', `COMICメテオ (COMIC Meteor)`, 'https://comic-meteor.jp', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }
    public override get Icon() {
        return icon;
    }

    public override async FetchChapters(manga: Manga): Promise<Chapter[]> {
        const request = new FetchRequest(new URL(manga.Identifier, this.URI).href);
        const contents = await FetchCSS(request, 'div#contents');
        const data = contents[0];
        let chapterList = [...data.querySelectorAll<HTMLAnchorElement>('div.work_episode div.work_episode_box div.work_episode_table div.work_episode_link_btn a')]
            .map(element => new Chapter(this, manga, element.pathname, element.closest('div.work_episode_table').querySelector<HTMLDivElement>('div.work_episode_txt').innerText.replace(manga.Title, '').trim()));
        if (chapterList.length == 0) {
            chapterList = [...data.querySelectorAll<HTMLAnchorElement>('div.latest_info_box div.latest_info_link_btn01 a')]
                .map(element => new Chapter(this, manga, element.pathname, element.text.replace('読む', '').trim()));
        }
        return chapterList;
    }
}