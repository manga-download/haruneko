// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './TruyenTranhAudio.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('truyentranhaudio', `Truyện tranh audio`, 'http://truyentranhaudio.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class TruyenTranhAudio extends FlatManga {

    constructor() {
        super();
        super.id = 'truyentranhaudio';
        super.label = 'Truyện tranh audio';
        this.tags = [ 'webtoon', 'vietnamese' ];
        this.url = 'http://truyentranhaudio.com';
        this.requestOptions.headers.set('x-referer', this.url);

        this.queryChapters = 'ul.list-chapters > a';
        this.queryChapterTitle = 'div.chapter-name';
        this.language = 'vn';
    }

    async _getPages(chapter) {
        let uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await this.fetchDOM(request, 'div.chapter-content > source');
        return data.map(element => {
            const url = this.getAbsolutePath(element.dataset.src || element, request.url);
            if(url.includes('forumnt.com')) {
                const uri = new URL('/proxy/proxy.php', this.url);
                uri.searchParams.set('url', url);
                return uri.href;
            } else {
                return url;
            }
        });
    }
}
*/