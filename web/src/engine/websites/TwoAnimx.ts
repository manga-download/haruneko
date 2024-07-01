import { Tags } from '../Tags';
import icon from './TwoAnimx.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise (resolve => {
        const pages = [];
        const total = $('#total').val();
        const name = window.location.pathname.match(/index-look-name-([^-]+)-/)[1];
        for (i = 1; i<= total;i++) {
            pages.push(window.location.origin + '/index-look-name-'+ name + '-cid-' + cid + '-id-' + id + '-p-'+ i)
        }
        resolve(pages);
    });
`;

@Common.MangaCSS(/^{origin}\/index-comic-name-[^/]+$/, 'div.position strong')
@Common.MangasMultiPageCSS('/index.php?s=%2Findex-html&page={page}', 'ul.liemh li > a[title]', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#oneCon1 ul.b1 li a')
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageAjaxFromHTML('img#ComicPic')
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('2animx', '2Animx', 'https://www.2animx.com', Tags.Media.Comic, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Media.Manga, Tags.Language.Chinese, Tags.Source.Aggregator);
    }

    public override get Icon() {
        return icon;
    }
}