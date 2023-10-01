import { Tags } from '../Tags';
import icon from './GolDragon.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

const pageScripts = `
    new Promise((resolve, reject) => {
        let t = new RocketLazyLoadScripts;
        t._loadEverythingNow();
        setTimeout(() => {
            resolve(ts_reader_control.getImages());
        }, 2500);
    });
`;

@MangaStream.MangaCSS(/^https?:\/\/goldragon\.me\/manga\/[^/]+$/, 'div.infox h1')
@MangaStream.MangasSinglePageCSS('div.soralist ul li a.series', '/manga/list-mode')
@MangaStream.ChaptersSinglePageCSS('div.bixbox.bxcl ul li span.lchx a')
@Common.PagesSinglePageJS(pageScripts)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goldragon', 'GolDragon', 'https://goldragon.me', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}