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

@Common.MangaCSS(/^{origin}\/series\/[^/]+\/$/, 'h1.post-title')
@Common.MangasMultiPageCSS('/page/{page}/?s&post_type=wp-manga', 'div.post-title h2 > a')
@Common.ChaptersSinglePageJS(chapterScript, 750)
@Common.PagesSinglePageCSS('div.page-break img:not([src])', img => [ ...img.attributes ].find(attribute => attribute.name.startsWith('data-img-')).value)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangacrab', 'Manga Crab', 'https://mangacrab.org', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Spanish, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}