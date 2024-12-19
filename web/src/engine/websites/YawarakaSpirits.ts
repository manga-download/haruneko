import { Tags } from '../Tags';
import icon from './YawarakaSpirits.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('dl dt').textContent.trim()
    };
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    return {
        id: anchor.pathname,
        title: anchor.querySelector('dl dt strong').textContent.trim()
    };
}

@Common.MangaCSS(/^{origin}\/[\S]+\/index.html$/, 'div.page__header h2')
@Common.MangasSinglePagesCSS([ '/series/', '/completion/' ], 'article.work section.work__inner ul li a, article.oldwork section.oldwork__inner ul li a ', MangaExtractor)
@Common.ChaptersSinglePageCSS('section.page__read div.page__read__inner ul.inner__content li a', ChapterExtractor)
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