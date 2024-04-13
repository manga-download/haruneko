import { Tags } from '../Tags';
import icon from './DoujinDesu.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';

const pageScript = `
    new Promise(resolve => {
        const chapterId = document.querySelector('main#reader').dataset.id;
        $.ajax({
            url: '/themes/ajax/ch.php',
            method: 'POST',
            data: {
                id: chapterId
            },
            success: function(data) {
                const dom = new DOMParser().parseFromString(data, 'text/html');
                resolve([...dom.querySelectorAll('img')].map(image => image.getAttribute('src')))
            }
        })
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+\/$/, 'section.metadata h1.title', Common.ElementLabelExtractor('span.alter'))
@Common.MangasMultiPageCSS('/manga/page/{page}/', 'article.entry a', 1, 1, 0, Common.AnchorInfoExtractor(true))
@Common.ChaptersSinglePageCSS('div#chapter_list div.epsleft span.lchx a', Common.AnchorInfoExtractor(true))
@Common.PagesSinglePageJS(pageScript, 2500)
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('doujindesu', 'DoujinDesu', 'https://doujindesu.tv', Tags.Media.Manga, Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Indonesian, Tags.Rating.Erotica);
    }

    public override get Icon() {
        return icon;
    }
}
