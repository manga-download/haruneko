import { Tags } from '../Tags';
import icon from './MangAs.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaReader from './templates/MangaReaderCMS';
import * as Common from './decorators/Common';

const chapterScript = `
    new Promise(resolve => {
        const path = window.location.pathname + (window.location.pathname.endsWith('/') ? '' : '/');
        resolve(jschaptertemp.map(chapter => {
            const subtitle = chapter.name.trim();
            return {
                id: path + chapter.slug,
                title: '#' + chapter.number + (subtitle ? ' ⠇' + subtitle : ''),
            }}));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, MangaReader.queryManga)
@Common.MangasMultiPageCSS('h5.media-heading a.chart-title', Common.PatternLinkGenerator('/filterList?sortBy=name&page={page}'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS(MangaReader.queryPages)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangas', 'MangAs', 'https://m440.in', Tags.Language.Spanish, Tags.Media.Manga, Tags.Media.Manhua, Tags.Media.Manhwa, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}