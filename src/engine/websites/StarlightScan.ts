import { Tags } from '../Tags';
import icon from './StarlightScan.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const chapterScript = `[...document.querySelectorAll('a.mangaDetails__episodeTitle')].map(element =>  {
    return {
        id: element.pathname+element.search,
        title: element.textContent.trim()
    }});
`;

@Common.MangaCSS(/^{origin}\/mangas\/[^/]+(\/)?$/, 'h1.mangaDetails__title')
@Common.MangasMultiPageCSS('a.bulkMangaCard__title', Common.PatternLinkGenerator('/mangas/?page-current={page}'))
@Common.ChaptersSinglePageJS(chapterScript, 500)
@Common.PagesSinglePageCSS('div.scanImagesContainer img')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('starlightscan', 'Starlight Scan', 'https://starligthscan.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Language.Portuguese, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }
}