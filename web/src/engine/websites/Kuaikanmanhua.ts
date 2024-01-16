import { Tags } from './../Tags';
import icon from './Kuaikanmanhua.webp';
import { DecoratableMangaScraper, Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import { FetchWindowScript } from '../platform/FetchProvider';

type MangaID = {
    id: string,
    title: string
}

const chapterScript = `
    new Promise(resolve => {
        let pages = [];
        try {
            pages = __NUXT__.data[0].comics.map(comic => {
                return {
                    id: '/web/comic/' + comic.id,
                    title: comic.title.trim()
                };
            }).reverse();
        } catch (error) {
            pages = __NUXT__.data[0].comicList.map(comic => {
                return {
                    id: '/web/comic/' + comic.id,
                    title: comic.title.trim()
                };
            }).reverse();
        }

        resolve(pages);
    });
`;

const pageScript = `
    new Promise(resolve => {
        resolve( __NUXT__.data[0].comicInfo.comicImages.map(img => img.url));
    });
`;

const mangascript = `
    new Promise(resolve => {
        resolve( { id : window.location.pathname, title : __NUXT__.data[0].topicInfo.title });
    });
`;

@Common.MangasMultiPageCSS('/tag/0?page={page}', 'div.tagContent div a')
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuaikanmanhua', `Kuaikanmanhua`, 'https://www.kuaikanmanhua.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }

    public override ValidateMangaURL(url: string): boolean {
        return /^https?:\/\/(m\.|www\.)?kuaikanmanhua\.com\/(mobile|web\/topic)\/\d+\//.test(url);
    }

    public override async FetchManga(provider: MangaPlugin, url: string): Promise<Manga> {
        const data = await FetchWindowScript<MangaID>(new Request(url), mangascript);
        return new Manga(this, provider, data.id, data.title);

    }

}
