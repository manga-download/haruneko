import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'miauscan',
        title: 'Miau Scan'
    },
    container: {
        url: 'https://leemiau.com/manga/685-dias/',
        id: '/manga/685-dias/',
        title: '685 días'
    },
    child: {
        id: '/685-dias-capitulo-1/',
        title: 'Capítulo 1'
    },
    entry: {
        index: 1,
        size: 246_995,
        type: 'image/jpeg'
    }
}).AssertWebsite();