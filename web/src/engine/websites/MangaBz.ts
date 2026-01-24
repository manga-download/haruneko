import { Tags } from '../Tags';
import icon from './MangaBz.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(async (resolve, reject) => {
        async function fetchScriptedImages() {
            const pagecount = window.MANGABZ_IMAGE_COUNT || 0;
            const imageScripts = await Promise.all([...(new Array(pagecount)).keys()].map(page => {
                return $.ajax({
                    url: 'chapterimage.ashx',
                    data: {
                        cid: window.MANGABZ_CID,
                        page: page + 1,
                        key: '',
                        _cid: window.MANGABZ_CID,
                        _mid: window.MANGABZ_MID,
                        _dt: window.MANGABZ_VIEWSIGN_DT,
                        _sign: window.MANGABZ_VIEWSIGN
                    }
                });
            }));
            return imageScripts.map(script => {
                eval(script);
                return new URL(d[0], window.location.href).href;
            });
        }
        try {
            const images = await fetchScriptedImages();
            resolve(images);
        } catch (error) {
            reject(error);
        }
    });
`;

@Common.MangaCSS(/^{origin}\/\d+bz\/$/, 'div.detail-info p.detail-info-title')
@Common.MangasMultiPageCSS('.mh-item-detali h2.title a', Common.PatternLinkGenerator('/manga-list-p{page}/'), 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapterlistload a.detail-list-form-item', undefined, Common.AnchorInfoExtractor(false, 'div.cover, p.subtitle, p.tip, span'))
@Common.PagesSinglePageJS(pageScript, 1000)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangabz', 'MangaBz', 'https://mangabz.com', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}
