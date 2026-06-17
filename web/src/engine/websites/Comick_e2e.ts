import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'comick',
        title: 'Comick (.live)'
    },
    container: {
        url: 'https://comick.live/comic/vagabond-official-colored',
        id: 'vagabond-official-colored',
        title: 'Vagabond (Official colored)'
    },
    child: {
        id: '/comic/vagabond-official-colored/ItLMDVD-chapter-16-en',
        title: 'Ch. 16 [Bato]'
    },
    entry: {
        index: 2,
        size: 787_754,
        type: 'image/webp'
    }
}).AssertWebsite();