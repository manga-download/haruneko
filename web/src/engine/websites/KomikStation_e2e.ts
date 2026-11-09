import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'komikstation',
        title: 'KomikStation'
    },
    container: {
        url: 'https://komikstation.org/manga/hack-g-u/',
        id: '/manga/hack-g-u/',
        title: '.hack//G.U.+'
    },
    child: {
        id: '/hack-g-u-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 1,
        size: 110_866,
        type: 'image/jpeg'
    }
}).AssertWebsite();