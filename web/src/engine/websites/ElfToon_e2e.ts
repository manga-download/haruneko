import { TestFixture } from '../../../test/WebsitesFixture';

new TestFixture({
    plugin: {
        id: 'elftoon',
        title: 'Elf Toon',
    },
    container: {
        url: 'https://elftoon.net/series/comic/number-one-beast-master',
        id: '/series/comic/number-one-beast-master',
        title: 'Number One Beast Master'
    },
    child: {
        id: '/series/comic/number-one-beast-master/chapter/61',
        title: 'Chapter 61'
    },
    entry: {
        index: 0,
        size: 624_834,
        type: 'image/webp'
    }
}).AssertWebsite();