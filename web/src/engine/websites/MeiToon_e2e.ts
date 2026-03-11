import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'meitoon',
        title: 'MeiToon'
    },
    container: {
        url: 'https://meitoon.org/series/63b65b74dca/',
        id: '/series/63b65b74dca/',
        title: 'Marriage of Convenience: An Unforgettable Song'
    },
    child: {
        id: '/chapter/63b65b74dca-63b65c59f79/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 743_179,
        type: 'image/jpeg'
    }
}).AssertWebsite();