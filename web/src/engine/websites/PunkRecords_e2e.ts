import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'littlegarden',
        title: 'Punk Records'
    },
    container: {
        url: 'https://punkrecordz.com/mangas/tokyo-revengers',
        id: 'tokyo-revengers',
        title: 'Tokyo Revengers'
    },
    child: {
        id: '5',
        title: '5'
    },
    entry: {
        index: 0,
        size: 361_980,
        type: 'image/webp'
    }
}).AssertWebsite();