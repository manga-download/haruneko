import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'delitoonx',
        title: 'DelitoonX'
    },
    container: {
        url: 'https://www.delitoonx.com/detail/dx_20218',
        id: 'dx_20218',
        title: 'Le détective clairvoyant  (Intro)'
    },
    child: {
        id: '1',
        title: '1 : Une nouvelle requête'
    },
    entry: {
        index: 0,
        size: 154_376,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();