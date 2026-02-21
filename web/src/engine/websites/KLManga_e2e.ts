import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'klmanga',
        title: 'KLManga',
    },
    container: {
        url: 'https://klz9.com/kanojo-okarishimasu-raw.html',
        id: 'kanojo-okarishimasu-raw',
        title: 'KANOJO, OKARISHIMASU',
    },
    child: {
        id: '207042',
        title: 'Chapter 250',
    },
    entry: {
        index: 16,
        size: 684_122,
        type: 'image/jpeg',
    }
}).AssertWebsite();