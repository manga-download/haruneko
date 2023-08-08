import { Tags } from '../Tags';
import icon from './DragonTranslation.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

function ChapterExtractor(anchor: HTMLAnchorElement) {
    const id = anchor.pathname;
    const title = anchor.querySelector('p.chapter-manhwa-title').textContent.trim();
    return { id, title };
}

@Common.MangaCSS(/^https?:\/\/dragontranslation\.net\/manga\/[^/]+$/,'div.post-title h1')
@Common.MangasMultiPageCSS('/mangas?page={page}', 'div.series-box a')
@Common.ChaptersSinglePageCSS('li.wp-manga-chapter a', ChapterExtractor)
@Common.PagesSinglePageCSS('div#chapter_imgs img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('dragontranslation', 'DragonTranslation', 'https://dragontranslation.net', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Spanish, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}