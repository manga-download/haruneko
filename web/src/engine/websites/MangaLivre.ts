import { Tags } from '../Tags';
import icon from './MangaLivre.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Madara from './decorators/WordPressMadara';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise ( resolve => {
        resolve( [...document.querySelectorAll('li.wp-manga-chapter a')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.text.trim()
            }
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title h1')
@Common.MangasMultiPageCSS('div.post-title h2 a', Common.PatternLinkGenerator('/manga/page/{page}/'))
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangalivre', 'MangaLivre', 'https://mangalivre.tv', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Source.Aggregator, Tags.Language.Portuguese);
    }

    public override get Icon() {
        return icon;
    }
}