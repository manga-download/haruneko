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

@Common.MangaCSS<HTMLImageElement>(/^{origin}\/0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/[^/]+$/, 'div.relative img',
    (img, uri) => ({ id: uri.pathname, title: img.alt.trim() }))
@Common.MangasMultiPageCSS<HTMLAnchorElement>('div.grid a', Common.PatternLinkGenerator('/projetos?page={page}'), 0,
    el => ({ id: el.pathname, title: el.querySelector<HTMLImageElement>('img').alt.trim() }))
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