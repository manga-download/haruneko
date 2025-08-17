import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'komikindome',
        title: 'KomikIndoMe'
    },
    container: {
        url: 'https://komikindo4.link/manga/secret-class/',
        id: '/manga/secret-class/',
        title: 'Secret Class'
    },
    child: {
        id: '/secret-class-chapter-217/',
        title: 'Chapter 217'
    },
    entry: {
        index: 0,
        size: 12_130,
        type: 'image/webp'
    }
}).AssertWebsite();