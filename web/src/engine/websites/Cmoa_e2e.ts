import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'cmoa',
        title: 'コミックシーモア (Cmoa)'
    },
    container: {
        url: 'https://www.cmoa.jp/title/151961/',
        id: '/title/151961/',
        title: '呪術廻戦'
    },
    child: {
        id: '/reader/sample/?title_id=151961&content_id=100001519610021',
        title: '21'
    },
    entry: {
        index: 0,
        size: 3_995_416,
        type: 'image/png'
    }
}).AssertWebsite();