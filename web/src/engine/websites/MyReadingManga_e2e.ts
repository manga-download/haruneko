import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'myreadingmanga',
        title: 'MyReadingManga',
    },
    container: {
        url: 'https://myreadingmanga.info/syaku-hare-to-mononoke-eng/',
        id: '/syaku-hare-to-mononoke-eng/',
        title: '[syaku] Hare to Mononoke [Eng] (update c.10)'
    },
    child: {
        id: '/syaku-hare-to-mononoke-eng/6/',
        title: '6'
    },
    entry: {
        index: 1,
        size: 115_355,
        type: 'image/jpeg'
    }
}).AssertWebsite();