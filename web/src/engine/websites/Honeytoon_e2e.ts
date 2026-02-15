import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: English
new TestFixture({
    plugin: {
        id: 'honeytoon',
        title: 'Honeytoon'
    },
    container: {
        url: 'https://honeytoon.com/comic/my-five-prominent-dadies',
        id: '/comic/my-five-prominent-dadies',
        title: 'My Five Prominent Dadies (en)'
    },
    child: {
        id: '/comic/my-five-prominent-dadies/1',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 72_084,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Spanish
new TestFixture({
    plugin: {
        id: 'honeytoon',
        title: 'Honeytoon'
    },
    container: {
        url: 'https://honeytoon.com/es/comic/el-canal-de-solmi',
        id: '/es/comic/el-canal-de-solmi',
        title: 'El Canal De Solmi (es)'
    },
    child: {
        id: '/es/comic/el-canal-de-solmi/1',
        title: 'Episodio 1'
    },
    entry: {
        index: 0,
        size: 145_610,
        type: 'image/webp'
    }
}).AssertWebsite();