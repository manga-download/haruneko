/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ero18x',
        title: 'Ero18x'
    },
    container: {
        url: 'https://ero18x.com/manga/secret-teaching-raws/',
        id: '/manga/secret-teaching-raws/',
        title: `Secret Class – raw`
    },
    child: {
        id: '/manga/secret-teaching-raws/chapter-255/',
        title: 'Chapter 255'
    },
    entry: {
        index: 0,
        size: 515_586,
        type: 'image/webp'
    }
}).AssertWebsite();
*/