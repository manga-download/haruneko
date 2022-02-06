// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './Boosei.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('boosei', `Boosei`, 'https://boosei.com' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class Boosei extends WordPressMangastream {

    constructor() {
        super();
        super.id = 'boosei';
        super.label = 'Boosei';
        this.tags = [ 'webtoon', 'indonesian' ];
        this.url = 'https://boosei.com';
        this.path = '/manga/list-mode/';
    }

    async _getPages(chapter) {
        const script = `
            new Promise((resolve) => {
                resolve(ts_reader_control.getImages());
            });
        `;
        const uri = new URL(chapter.id, this.url);
        let request = new Request(uri, this.requestOptions);
        let data = await Engine.Request.fetchUI(request, script);
        return data.map(link => this.getAbsolutePath(link, request.url));
    }
}
*/