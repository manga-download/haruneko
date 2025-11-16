import { Tags } from '../Tags';
import icon from './Laimanhua8.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const endpoints = 'abcdefghijklmnopqrstuvwxyz'.split('').map(segment => `/kanmanhua/${segment}.html`);
const pageScript = `getUrlpics().map(segment => getrealurl(segment))`;

@Common.MangaCSS(/^{origin}\/kanmanhua\/[^/]+\/$/, 'div.title h1')
@Common.MangasMultiPageCSS('div#dmList ul li dl dt a', Common.StaticLinkGenerator(...endpoints))
@Common.ChaptersSinglePageCSS('div.plist ul li a')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjax(true)
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('laimanhua8', 'Laimanhua8', 'https://www.laimanhua88.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}