import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'hadesnofansub',
        title: 'Hades No Fansub'
    },
    container: {
        url: 'https://hadesnofansub.com/manga/dark-star-emperor/',
        id: JSON.stringify({ post: '117', slug: '/manga/dark-star-emperor/' }),
        title: 'Dark Star Emperor'
    },
    child: {
        id: '/manga/dark-star-emperor/1/',
        title: '1'
    },
    entry: {
        index: 0,
        size: 604_438,
        type: 'image/webp'
    }
};

new TestFixture(config).AssertWebsite();