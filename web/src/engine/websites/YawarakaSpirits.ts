import { Tags } from '../Tags';
import icon from './YawarakaSpirits.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

@Common.MangaCSS(/^{origin}\/[\S]+\/index.html$/, 'div.page__header h2')
@Common.MangasMultiPageCSS<HTMLAnchorElement>('article.work section.work__inner ul li a, article.oldwork section.oldwork__inner ul li a ', Common.StaticLinkGenerator('/series/', '/completion/'), 0,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('dl dt strong').textContent.trim() }))
@Common.ChaptersSinglePageCSS<HTMLAnchorElement>('section.page__read div.page__read__inner ul.inner__content li a', undefined,
    anchor => ({ id: anchor.pathname, title: anchor.querySelector('dl dt').textContent.trim() }))
@Common.PagesSinglePageCSS('div.page__detail__inner div.page__detail__vertical div.vertical__inner ul li img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('yawarakaspirits', `やわらかスピリッツ (Yawaraka Spirits)`, 'https://yawaspi.com', Tags.Language.Japanese, Tags.Media.Manga, Tags.Source.Official);
    }

    public override get Icon() {
        return icon;
    }
}