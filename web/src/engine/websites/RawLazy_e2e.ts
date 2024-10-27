import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'rawlazy',
        title: 'RawLazy'
    },
    container: {
        url: 'https://rawlazy.is/manga-lazy/彼女-お借りします-raw-free/',
        id: encodeURI('/manga-lazy/彼女-お借りします-raw-free/'),
        title: '彼女、お借りします'
    },
    child: {
        id: encodeURI('/manga-chapter/彼女、お借りします-raw-【第340話】/').toLowerCase(),
        title: '第340話'
    },
    entry: {
        index: 0,
        size: 276_488,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();