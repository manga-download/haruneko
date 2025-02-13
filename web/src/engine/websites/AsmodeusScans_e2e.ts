import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'asmodeusscans',
        title: 'Asmodeus Scans'
    },
    container: {
        url: 'https://asmotoon.com/series/62de13d4003/',
        id: '/series/62de13d4003/',
        title: 'Killing Field'
    },
    child: {
        id: '/chapter/62de13d4003-62df20bd8bf/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 1_001_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();