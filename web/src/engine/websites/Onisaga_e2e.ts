import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'onisaga',
        title: 'Onisaga'
    },
    container: {
        url: 'https://onisaga.com/title/the-boy-of-death',
        id: '/title/the-boy-of-death',
        title: 'The Boy of Death',
        timeout: 15_000
    },
    child: {
        id: '/read/the-boy-of-death/100560002',
        title: 'Chapter 1 [en]',
        timeout: 15_000
    },
    entry: {
        index: 1,
        size: 502_924,
        type: 'image/jpeg'
    }
}).AssertWebsite();