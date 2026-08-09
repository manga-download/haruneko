import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture( {
    plugin: {
        id: 'mangapill',
        title: 'MangaPill'
    },
    container: {
        url: 'https://mangapill.com/manga/723/chainsaw-man',
        id: '/manga/723/chainsaw-man',
        title: 'Chainsaw Man'
    },
    child: {
        id: '/chapters/723-10122000/chainsaw-man-chapter-122',
        title: 'Chapter 122'
    },
    entry: {
        index: 0,
        size: 378_945,
        type: 'image/jpeg'
    }
}).AssertWebsite();