import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: Manga with clean title
new TestFixture({
    plugin: {
        id: 'crunchyscan',
        title: 'Crunchyscan'
    },
    container: {
        url: 'https://crunchyscan.fr/lecture-en-ligne/appleseed',
        id: '/lecture-en-ligne/appleseed',
        title: 'Appleseed'
    },
    child: {
        id: '/lecture-en-ligne/appleseed/read/volume-1',
        title: '.volume 1'
    },
    entry: {
        index: 0, // ~ 124
        size: 153_100,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE: WebToon with NSWF prefixed title
new TestFixture({
    plugin: {
        id: 'crunchyscan',
        title: 'Crunchyscan'
    },
    container: {
        url: 'https://crunchyscan.fr/lecture-en-ligne/adulte-non-censuree-the-young-wife',
        id: '/lecture-en-ligne/adulte-non-censuree-the-young-wife',
        title: 'The Young Wife'
    },
    child: {
        id: '/lecture-en-ligne/adulte-non-censuree-the-young-wife/read/episode-23',
        title: 'Episode #23'
    },
    entry: {
        index: 0, // ~ 4
        size: 8_509_316,
        type: 'image/jpeg'
    }
}).AssertWebsite();