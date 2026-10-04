import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'catharsisworld',
        title: 'Catharsis World'
    },
    container: {
        url: 'https://newcatharsis.dig-it.info/manga/mision-romance-sincero',
        id: '996',
        title: 'Misión: Romance Sincero'
    },
    child: {
        id: '32336',
        title: 'Capitulo 1',
    },
    entry: {
        index: 0,
        size: 524_514,
        type: 'image/webp'
    }
}).AssertWebsite();