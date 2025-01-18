import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lezhin-en',
        title: 'Lezhin (English)'
    },
    container: {
        url: 'https://www.lezhinus.com/en/comic/im_no_heroine',
        id: '/en/comic/im_no_heroine',
        title: `I'm No Heroine!`
    },
    child: {
        id: '/en/comic/im_no_heroine/1',
        title: 'Episode 1',
        timeout: 15000
    },
    entry: {
        index: 0,
        size: 198_750,
        type: 'image/webp'
    }
}).AssertWebsite();