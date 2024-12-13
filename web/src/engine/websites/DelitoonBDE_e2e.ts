import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'delitoonbde',
        title: 'Delitoon B (German)'
    },
    container: {
        url: 'https://www.delitoonb.de/detail/dbd_40009',
        id: 'dbd_40009',
        title: 'Unumkehrbar'
    },
    child: {
        id: '1',
        title: '1'
    },
    entry: {
        index: 0,
        size: 237_264,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();