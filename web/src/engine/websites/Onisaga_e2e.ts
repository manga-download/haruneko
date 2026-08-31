import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'onisaga',
        title: 'Onisaga'
    },
    container: {
        url: 'https://onisaga.com/manga/the-boy-of-death',
        id: '/manga/the-boy-of-death',
        title: 'The Boy of Death'
    },
    child: {
        id: '/read/the-boy-of-death/570007',
        title: 'Chapter 1 [en]'
    },
    entry: {
        index: 1,
        size: 502_924,
        type: 'image/jpeg'
    }
}).AssertWebsite();