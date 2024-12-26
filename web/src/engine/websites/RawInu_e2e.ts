import { TestFixture, type Config } from '../../../test/WebsitesFixture';

const config: Config = {
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
        id: '/chapter-44-cthide-tatari-watari.html',
        title: 'Chapter 44'
    },
    entry: {
        index: 0,
        size: 548_603,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();