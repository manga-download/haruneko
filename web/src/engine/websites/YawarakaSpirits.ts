import { Tags } from '../Tags';
import icon from './YawarakaSpirits.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin, type MangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('dl dt').textContent.trim();
    return { id, title };
}

function MangaExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('dl dt strong').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^{origin}\/[\S]+\/index.html$/, 'div.page__header h2')
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

    public override async FetchMangas(this: MangaScraper, provider: MangaPlugin): Promise<Manga[]> {
        const mangalist = [];
        const path = ['/series/', '/completion/'];
        for (const p of path) {
            const mangas = await Common.FetchMangasSinglePageCSS.call(this, provider, p, 'article.work section.work__inner ul li a, article.oldwork section.oldwork__inner ul li a ', MangaExtractor);
            if (mangas.length > 0) {
                mangalist.push(...mangas);
            }
        }
        return mangalist;

    }

}