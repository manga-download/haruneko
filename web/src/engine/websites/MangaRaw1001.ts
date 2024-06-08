import { Tags } from '../Tags';
import icon from './MangaRaw1001.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

const pageScript = `
    new Promise(resolve => {
        function parseResults(data) {
            const dom = new DOMParser().parseFromString(data, 'text/html');
            let nodes = [...dom.querySelectorAll('div.imageChap img.image-chapter')];
            resolve(nodes.map(element => element.src));
        }

        const ajaxendpoint = new URL('/ajax/image/list/chap/'+ CHAPTER_ID, window.location.origin);
        fetch(ajaxendpoint, {
            headers: {
                'X-Requested-With' : 'XMLHttpRequest',
            }})
            .then(response => response.json())
            .then(jsonData => {
                  parseResults(jsonData.html);
            });
    });
`;

@Common.MangaCSS(/^{origin}\/manga\/[^/]+$/, 'div.detail_infomation div.detail_name')
@Common.MangasMultiPageCSS('/all-manga/{page}', 'div.story_item div.mg_info div.mg_name > a')
@Common.ChaptersSinglePageCSS(MangaReader.queryChapters)
@Common.PagesSinglePageJS(pageScript, 500)
@Common.ImageElement()
export default class extends DecoratableMangaScraper {
    public override get Icon() {
        return icon;
    }

    public constructor() {
        super('mangaraw1001', 'MangaRaw1001', 'https://mangaraw1001.cc', Tags.Media.Manga, Tags.Language.Japanese, Tags.Source.Aggregator);
    }
}