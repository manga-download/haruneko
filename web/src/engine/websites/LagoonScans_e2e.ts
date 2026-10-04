import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'lagoonscans',
        title: 'Lagoon Scans'
    },
    container: {
        url: 'https://lagoonscans.com/manga/latna-saga-survival-of-a-sword-king/',
        id: '/manga/latna-saga-survival-of-a-sword-king/',
        title: 'Latna Saga: Survival of a Sword King'
    },
    child: {
        id: '/latna-saga-survival-of-a-sword-king-chapter-272/',
        title: 'Chapter 272',
        timeout: 10_000
    },
    entry: {
        index: 0,
        size: 862_604,
        type: 'image/webp'
    }
}).AssertWebsite();