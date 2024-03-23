import { Tags } from '../Tags';
import icon from './Laimanhua8.webp';
import { DecoratableMangaScraper, type Manga, type MangaPlugin } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise( resolve => {
        resolve(
            getUrlpics().map(element => getrealurl(element))
        );
    });
`;

@Common.MangaCSS(/^{origin}\/kanmanhua\/[^/]+\/$/, 'div.title h1')
@Common.ChaptersSinglePageCSS('div.plist ul li a')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax()

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('laimanhua8', 'Laimanhua8', 'https://www.laimanhua8.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }

    public override async FetchMangas(provider: MangaPlugin): Promise<Manga[]> {
        const mangalist : Manga[] = [];
        const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
        for (const letter of alphabet) {
            mangalist.push(... await Common.FetchMangasSinglePageCSS.call(this, provider, `/kanmanhua/${letter}.html`, 'div#dmList ul li dl dt a'));
        }
        return mangalist.distinct();
    }

}