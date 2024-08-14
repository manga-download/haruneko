import { Tags } from '../Tags';
import icon from './ArgosScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as Madara from './decorators/WordPressMadara';

const chapterScript = `
    new Promise ( resolve => {
        resolve( [...document.querySelectorAll('li.wp-manga-chapter a')].map(chapter => {
            return {
                id: chapter.pathname,
                title : chapter.textContent.trim()
            }
        }));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'div.post-title h1')
@Common.MangasMultiPageCSS('/page/{page}/', 'div.post-title h3 a, div.post-title h5 a')
@Common.ChaptersSinglePageJS(chapterScript, 5000)
@Madara.PagesSinglePageCSS()
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('argosscan', `Argos Scan`, 'https://argoscomic.com', Tags.Language.Portuguese, Tags.Source.Scanlator, Tags.Media.Manhwa, Tags.Media.Manga);
    }

    public override get Icon() {
        return icon;
    }

}