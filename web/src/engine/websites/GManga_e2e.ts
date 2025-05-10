import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'gmanga',
        title: 'GManga'
    },
    container: {
        url: 'https://gmanga.net/manga/6000',
        id: '/manga/6000',
        title: '6000'
    },
    child: {
        id: '/scan/24248',
        title: '16 - Hell'
    },
    entry: {
        index: 0,
        size: 258_288,
        type: 'image/avif'
    }
}).AssertWebsite();