import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'gourmetscans',
        title: 'Gourmet Scans'
    },
    container: {
        url: 'https://gourmetsupremacy.com/project/an-unseemly-lady/',
        id: JSON.stringify({ post: '4484', slug: '/project/an-unseemly-lady/' }),
        title: 'An Unseemly Lady',
    },
    child: {
        id: '/project/an-unseemly-lady/chapter-0/',
        title: 'Chapter 0 - Prologue',
        timeout: 20000
    },
    entry: {
        index: 0,
        size: 217_494,
        type: 'image/jpeg'
    }
};

new TestFixture(config).AssertWebsite();