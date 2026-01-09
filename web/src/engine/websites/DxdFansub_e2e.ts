import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'dxdfansub',
        title: 'DxD Fansub'
    },
    container: {
        url: 'https://www.dxdfansub.com/2025/12/sis-diyar.html',
        id: '/2025/12/sis-diyar.html',
        title: 'Sis Diyarı'
    },
    child: {
        id: '/2025/12/chapter-16_21.html',
        title: 'Chapter 16'
    },
    entry: {
        index: 0,
        size: 744_149,
        type: 'image/jpeg'
    }
}).AssertWebsite();