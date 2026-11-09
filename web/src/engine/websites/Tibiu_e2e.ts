import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'tibiu',
        title: 'Tibiu',
    },
    container: {
        url: 'https://comic.tibiu.net/comic/54101',
        id: '54101',
        title: 'Daisy Jealousy〔爱著你的善妒〕'
    },
    child: {
        id: '576122',
        title: '第1话'
    },
    entry: {
        index: 0,
        size: 252_736,
        type: 'image/webp'
    }
}).AssertWebsite();