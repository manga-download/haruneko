import { Tags } from '../Tags';
import icon from './MangaRaw1001.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as Common from './decorators/Common';
import * as MangaReader from './decorators/MangaReaderCMS';

const pageScript = `
    new Promise((resolve, reject) => {
        $.post('/ajax/image/list/chap/' + CHAPTER_ID)
            .done(response => response.status ? resolve($('.imageChap img', '<div>' + response.html + '</div>').map((_, img) => img.src).get()) : reject([]))
            .fail((_xhr, _status, _error) => reject([]));
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