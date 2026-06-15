import { TestFixture } from '../../../test/WebsitesFixture';

// CASE: English, Safe
new TestFixture({
    plugin: {
        id: 'honeytoon',
        title: 'Honeytoon'
    },
    container: {
        url: 'https://honeytoon.com/comic/my-apprentice-game-over-again',
        id: '/comic/my-apprentice-game-over-again',
        title: 'My Apprentice: Game over again! (en)'
    },
    child: {
        id: '/comic/my-apprentice-game-over-again/1',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 124_958,
        type: 'image/webp'
    }
}).AssertWebsite();

// CASE: Spanish, Adult
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