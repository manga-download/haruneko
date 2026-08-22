import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'heroswebnew',
        title: `Hero's (ヒーローズ)( new )`
    },
    container: {
        url: 'https://heros-web.com/series/3eb63ea3a0063',
        id: '/series/3eb63ea3a0063',
        title: 'ニワトリ・ファイター'
    },
    child: {
        id: '/episodes/6a943175916fe',
        title: '第1羽　獣聚鳥散'
    },
    entry: {
        index: 2,
        size: 843_972,
        type: 'image/png'
    }
}).AssertWebsite();