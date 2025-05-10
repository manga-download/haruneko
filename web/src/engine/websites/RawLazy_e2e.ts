import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'rawlazy',
        title: 'RawLazy'
    },
    container: {
        url: 'https://rawlazy.io/manga-lazy/彼女-お借りします-raw-free/',
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
}).AssertWebsite();