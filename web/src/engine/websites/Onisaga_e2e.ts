import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Normal content
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

// CASE: Mature content
new TestFixture({
    plugin: {
        id: 'onisaga',
        title: 'Onisaga'
    },
    container: {
        url: 'https://onisaga.com/title/one-room-ta',
        id: '/title/one-room-ta',
        title: 'One Room TA',
    },
    child: {
        id: '/read/one-room-ta/103561771',
        title: 'Chapter 1',
    },
    entry: {
        index: 0,
        size: 270_304,
        type: 'image/webp'
    }
}).AssertWebsite();