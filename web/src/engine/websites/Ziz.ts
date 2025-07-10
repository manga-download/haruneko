import { Tags } from '../Tags';
import icon from './Ziz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise( resolve => {
        const jsonPages = JSON.parse(document.getElementById('pages-data-json').textContent);
        const apiPath = JSON.parse(document.getElementById('reader-config-json').textContent).page_api_url_base;
        resolve ( jsonPages.map( page => new URL( apiPath + page.id+ '/', window.location.origin).href  ));
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'title', (element) => element.textContent.split('-').at(0).trim())
@Common.MangasMultiPageCSS('/mangas/?page={page}', 'div.content-grid a', 1, 1, 0, Common.AnchorInfoExtractor(false, 'p, span'))
@Common.ChaptersSinglePageCSS('div#chapterList a.chapter-item', Common.AnchorInfoExtractor(false, 'p, span'))
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('drakescans', 'Ziz', 'https://www.zzizz.xyz', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.English, Tags.Source.Scanlator);
    }

    public override get Icon() {
        return icon;
    }

}