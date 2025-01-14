import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawinu',
        title: 'RawInu'
    },
    container: {
        url: 'https://rawinu.com/manga-tatari-watari.html',
        id: '/manga-tatari-watari.html',
        title: 'TATARI (WATARI)'
    },
    child: {
        id: '/manga/tatari-watari/chapter-44.html',
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 548_603,
        type: 'image/jpeg'
    }
}).AssertWebsite();