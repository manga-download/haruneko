import { Tags } from '../Tags';
import icon from './MangaCrab.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `
    [ ...document.querySelectorAll('li.wp-manga-chapter div.parm-extras > a') ].map(element => ({
        id: element.pathname,
        title : element.text.trim(),
    }));
`;

const pageScript = `
    [...document.querySelectorAll('div.page-break img.wp-manga-chapter-img[id^="image-"]')]
        .map(img => [...img.attributes].find(attribute => attribute.value.startsWith('/encript.php'))?.value)
        .filter(img => img);
`;

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'h1.post-title')
@Common.MangasMultiPageCSS('div.post-title h2 > a', Common.PatternLinkGenerator('/page/{page}/?s&post_type=wp-manga'))
@Common.ChaptersSinglePageJS(chapterScript, 750)
@Common.PagesSinglePageJS(pageScript, 0)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://mangacrab.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
