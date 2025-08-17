import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'catharsisworld',
        title: 'Catharsis World'
    },
    container: {
        url: 'https://catharsisworld.akan01.com/serie/mision-romance-sincero/',
        id: '/serie/mision-romance-sincero/',
        title: 'Misión: Romance Sincero'
    },
    child: {
        id: '/serie/mision-romance-sincero/capitulo-1/',
        title: 'Capitulo 1'
    },
    entry: {
        index: 0,
        size: 524_514,
        type: 'image/webp'
    }
}).AssertWebsite();