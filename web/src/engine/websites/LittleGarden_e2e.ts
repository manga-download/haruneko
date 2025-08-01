import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'littlegarden',
        title: 'Little Garden'
    },
    container: {
        url: 'https://littlexgarden.com/tokyo-revengers',
        id: '/tokyo-revengers',
        title: 'Tokyo Revengers'
    },
    child: {
        id: JSON.stringify({ id: 3255, number: 5 }),
        title: '5'
    },
    entry: {
        index: 0,
        size: 3_369_042,
        type: 'image/jpeg'
    }
}).AssertWebsite();