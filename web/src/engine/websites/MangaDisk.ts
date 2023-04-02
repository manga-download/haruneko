// Auto-Generated export from HakuNeko Legacy
import { Tags } from '../Tags';
import icon from './MangaDisk.webp';
import { DecoratableMangaScraper } from '../providers/MangaPlugin';
import * as MangaStream from './decorators/WordPressMangaStream';
import * as Common from './decorators/Common';

@MangaStream.MangaCSS(/^https?:\/\/mangadisk\.web\.id\/manga\/[^/]+\/$/)
@MangaStream.MangasSinglePageCSS()
@MangaStream.ChaptersSinglePageCSS()
@MangaStream.PagesSinglePageCSS([], 'div#readerarea canvas')
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mangadisk', 'Manga Disk', 'https://mangadisk.web.id', Tags.Media.Manga, Tags.Language.Indonesian);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MangaDisk extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'mangadisk';
        super.label = 'Manga Disk';
        this.tags = [ 'manga', 'indonesian' ];
        this.url = 'https://mangadisk.web.id';
        this.path = '/manga/list-mode/';
        this.queryPages = 'div#readerarea canvas';
        this.requestOptions.headers.set('x-referer', this.url);
    }

    async _getPages(chapter) {
        const uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, this.queryPages);

        return data.map(hash => {
            return this.createConnectorURI('https://img.nesia.my.id/image?id='+hash.getAttribute('file-id'));
        });
    }
}
*/