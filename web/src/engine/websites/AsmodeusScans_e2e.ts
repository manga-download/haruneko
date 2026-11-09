import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'asmodeusscans',
        title: 'Asmodeus Scans'
    },
    container: {
        url: 'https://asmotoon.com/killing-field',
        id: '/killing-field',
        title: 'Killing Field'
    },
    child: {
        id: '/killing-field-chapter-1',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 1_001_585,
        type: 'image/jpeg'
    }
}).AssertWebsite();