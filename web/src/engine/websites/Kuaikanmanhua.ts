import { Tags } from './../Tags';
import icon from './Kuaikanmanhua.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^https?:\/\/(m\.|www\.)?kuaikanmanhua\.com\/(mobile|web\/topic)\/\d+\//, 'div.TopicList h3.title')
@Common.MangasMultiPageCSS('div.tagContent div a', Common.PatternLinkGenerator('/tag/0?page={page}'))
@Common.ChaptersSinglePageJS(`(__NUXT__.data[0].comics ?? __NUXT__.data[0].comicList).map(({ id, title}) => ({  id: '/web/comic/'+ id, title })).reverse();`, 500)
@Common.PagesSinglePageJS(`__NUXT__.data[0].comicInfo.comicImages.map(img => img.url)`, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('kuaikanmanhua', `Kuaikanmanhua`, 'https://www.kuaikanmanhua.com', Tags.Language.Chinese, Tags.Media.Manhua, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}
