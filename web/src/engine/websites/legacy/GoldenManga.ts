import { Tags } from '../../Tags';
import icon from './GoldenManga.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';
import * as Madara from '../decorators/WordPressMadara';
import * as Common from '../decorators/Common';

@Madara.MangaCSS(/^https?:\/\/golden-manga\.com\/mangas\/[^/]+\/?$/, 'div.manga-title h1')
@Madara.MangasMultiPageAJAX()
@Madara.ChaptersSinglePageAJAXv1()
@Madara.PagesSinglePageCSS()
@Common.ImageAjax()
export default class extends DecoratableMangaScraper {

    public constructor() {
        super('goldenmanga', 'المانجا الذهبية (Golden Manga)', 'https://golden-manga.com', Tags.Media.Manhwa, Tags.Media.Manhua, Tags.Language.Arabic);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class GoldenManga extends WordPressMadara {

    constructor() {
        super();
        super.id = 'goldenmanga';
        super.label = 'المانجا الذهبية (Golden Manga)';
        this.tags = [ 'webtoon', 'arabic' ];
        this.url = 'https://golden-manga.com';
    }

    async _getChapters(manga) {
        let uri = new URL( manga.id, this.url );
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.page-content-listing div.main > a');
        return data.map(element => {
            return {
                id: this.getRootRelativeOrAbsoluteLink(element, request.url),
                title: element.querySelector('h6').textContent.trim(),
                language: ''
            };
        });
    }
}
*/