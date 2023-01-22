// Auto-Generated export from HakuNeko Legacy
// See: https://gist.github.com/ronny1982/0c8d5d4f0bd9c1f1b21dbf9a2ffbfec9

//import { Tags } from '../../Tags';
import icon from './MyNovel.webp';
import { DecoratableMangaScraper } from '../../providers/MangaPlugin';

export default class extends DecoratableMangaScraper {

    public constructor() {
        super('mynovel', `MyNovel`, 'https://mynovel.net' /*, Tags.Language.English, Tags ... */);
    }

    public override get Icon() {
        return icon;
    }
}

// Original Source
/*
class MyNovel extends WordPressMadaraNovel {

    constructor() {
        super();
        super.id = 'mynovel';
        super.label = 'MyNovel';
        this.tags = [ 'novel', 'indonesian' ];
        this.url = 'https://mynovel.net';

        this.queryChapters = 'li.wp-novel-chapter > a';
        this.novelObstaclesQuery = 'div.addtoany_content';
    }

    _createMangaRequest(page) {
        let form = new URLSearchParams();
        form.append('action', 'mynovel_load_more');
        form.append('template', 'mynovel-core/content/content-archive');
        form.append('page', page);
        form.append('vars[paged]', '0');
        form.append('vars[post_type]', 'wp-novel');
        form.append('vars[posts_per_page]', '250');

        this.requestOptions.method = 'POST';
        this.requestOptions.body = form.toString();
        let request = new Request(this.url + '/wp-admin/admin-ajax.php', this.requestOptions);
        request.headers.set('content-type', 'application/x-www-form-urlencoded');
        this.requestOptions.method = 'GET';
        delete this.requestOptions.body;
        return request;
    }
}
*/