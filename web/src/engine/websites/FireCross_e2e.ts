import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'firecross',
        title: 'FireCross'
    },
    container: {
        url: 'https://firecross.jp/ebook/series/235',
        id: '/ebook/series/235',
        title: '精霊幻想記'
    },
    /* Chapters are tokenified
    child: {
        id: JSON.stringify({ token: '', id: '235' }),
        title: '第57話'
    },
    entry: {
        index: 0,
        size: -1,
        type: 'image/png'
    }*/
};

new TestFixture(config).AssertWebsite();