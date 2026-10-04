import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lerhentais',
        title: 'LerHentais'
    },
    container: {
        url: 'https://lerhentais.com/manga/nama-hone-josou',
        id: '24506/nama-hone-josou',
        title: 'Nama-Hone Josou'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 325_942,
        type: 'image/jpeg'
    }
}).AssertWebsite();