import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'storiadash',
        title: 'ストーリアダッシュ (Storia Dash)'
    },
    container: {
        url: 'https://storia.takeshobo.co.jp/manga/small_senior/',
        id: '/manga/small_senior/',
        title: 'うちの会社の小さい先輩の話'
    },
    child: {
        id: '/_files/small_senior/01/',
        title: '第1話 。'
    },
    entry: {
        index: 0,
        size: 1_570_283,
        type: 'image/png'
    }
}).AssertWebsite();