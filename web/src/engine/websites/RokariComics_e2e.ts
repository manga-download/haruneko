import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rokaricomics',
        title: 'Rokari Comics',
    },
    container: {
        url: 'https://rokaricomics.com/manga/black-chain/',
        id: '/manga/black-chain/',
        title: 'Black Chain'
    },
    child: {
        id: '/black-chain-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 218_101,
        type: 'image/jpeg'
    }
}).AssertWebsite();