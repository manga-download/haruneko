/* NW.js crash on website initialize => CloudFlare
import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'casacomic',
        title: 'Casa Comic'
    },
    container: {
        url: 'https://casacomic.com/series/18012433589/',
        id: '/series/18012433589/',
        title: 'The Archvillain’s Daughter in Law'
    },
    child: {
        id: '/chapter/18012433589-8305e0d65cf/',
        title: 'Chapter 93'
    },
    entry: {
        index: 0,
        size: 749_437,
        type: 'image/jpeg'
    }
}).AssertWebsite();
*/