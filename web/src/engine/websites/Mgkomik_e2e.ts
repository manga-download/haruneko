import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'mgkomik',
        title: 'MGKOMIK'
    },
    container: {
        url: 'https://web.mgkomik.cc/komik/the-life-after-god-of-martial-lived-in-seclusion/',
        id: '/komik/the-life-after-god-of-martial-lived-in-seclusion/',
        title: 'The Life After God Of Martial Lived In Seclusion'
    },
    child: {
        id: '/komik/the-life-after-god-of-martial-lived-in-seclusion/chapter-01/',
        title: 'Chapter 01'
    },
    entry: {
        index: 1,
        size: 251_852,
        type: 'image/webp'
    }
}).AssertWebsite();