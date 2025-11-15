import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'hadesnofansub',
        title: 'Hades No Fansub'
    },
    container: {
        url: 'https://lectorhades.latamtoon.com/tmo/dark-star-emperor/',
        id: JSON.stringify({ post: '2758', slug: '/tmo/dark-star-emperor/' }),
        title: 'Dark Star Emperor'
    },
    child: {
        id: '/tmo/dark-star-emperor/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 604_438,
        type: 'image/webp'
    }
}).AssertWebsite();