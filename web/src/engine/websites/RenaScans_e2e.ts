import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'renascans',
        title: 'RenaScans',
    },
    container: {
        url: 'https://renascans.net/manga/black-history-again-drikz4dj',
        id: 'black-history-again-drikz4dj',
        title: 'Black History Again'
    },
    child: {
        id: '3531',
        title: 'Chapter 11'
    },
    entry: {
        index: 1,
        size: 543_616,
        type: 'image/webp'
    }
}).AssertWebsite();