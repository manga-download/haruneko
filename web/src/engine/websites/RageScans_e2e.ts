import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'ragescans',
        title: 'RageScans'
    },
    container: {
        url: 'https://ragescans.com/manga/ah-its-wonderful-to-be-alive/',
        id: '/manga/ah-its-wonderful-to-be-alive/',
        title: 'Ah, It’s Wonderful To Be Alive'
    },
    child: {
        id: '/ah-its-wonderful-to-be-alive-chapter-1/',
        title: 'Chapter 1'
    },
    entry: {
        index: 0,
        size: 466_177,
        type: 'image/jpeg'
    }
}).AssertWebsite();