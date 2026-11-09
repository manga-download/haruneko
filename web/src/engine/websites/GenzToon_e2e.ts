import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'genztoon',
        title: 'GenzToon'
    },
    container: {
        url: 'https://genztoons.org/series/a-bad-person/',
        id: '/series/a-bad-person/',
        title: 'A Bad Person'
    },
    child: {
        id: '/chapter/7e80e1ac248-96457646279/',
        title: 'Chapter 120',
        timeout: 10000
    },
    entry: {
        index: 0,
        size: 1_119_635,
        type: 'image/jpeg'
    }
}).AssertWebsite();