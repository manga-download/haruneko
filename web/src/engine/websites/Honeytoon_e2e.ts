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
        title: 'My Five Prominent Dadies'
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
        url: 'https://honeytoon.com/es/comic/mis-cinco-papas-prominentes',
        id: '/es/comic/mis-cinco-papas-prominentes',
        title: 'Mis Cinco Papás Prominentes'
    },
    child: {
        id: '/es/comic/mis-cinco-papas-prominentes/1',
        title: 'Episodio 1'
    },
    entry: {
        index: 0,
        size: 72_084,
        type: 'image/webp'
    }
}).AssertWebsite();