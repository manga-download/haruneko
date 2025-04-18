import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'delitoonbde',
        title: 'Delitoon B (German)'
    },
    container: {
        url: 'https://www.delitoonb.de/detail/dbd_20396',
        id: 'dbd_20396',
        title: 'Spuren der Leere'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 126_700,
        type: 'image/webp'
    }
}).AssertWebsite();