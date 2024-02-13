import { Tags } from '../Tags';
import icon from './Desu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const scriptPages = `
    new Promise((resolve, reject) => {
        try {
            resolve(Reader.images.map(element => new URL(element.url, window.location.origin)));
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/[^/]+\//, 'div.titleBar h1 span.name')
@Common.MangasMultiPageCSS('/manga/?page={page}', 'h3 a.animeTitle.oTitle')
@Common.ChaptersSinglePageCSS('div#animeView div.expandable ul.chlist li h4 a')
@Common.PagesSinglePageJS(scriptPages, 500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('desu', `Desu`, 'https://desu.me', Tags.Language.Russian, Tags.Media.Manga, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
