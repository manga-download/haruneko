/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'doujinku',
        title: 'Doujinku'
    },
    container: {
        url: 'https://doujinku.org/manga/no-mans-land/',
        id: '/manga/no-mans-land/',
        title: 'No Man’s Land'
    },
    child: {
        id: '/no-mans-land-chapter-40/',
        title: 'Chapter 40'
    },
    entry: {
        index: 1,
        size: 550_637,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/