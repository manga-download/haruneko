import { TestFixture } from '../../../test/WebsitesFixture';

// CASE : English manga
new TestFixture({
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/en/book/the-duchess-who-sees-ghosts',
        id: '345',
        title: 'The Duchess Who Sees Ghosts'
    },
    child: {
        id: '121754322',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 529_700,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : French manga
new TestFixture({
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/fr/book/the-duchess-who-sees-ghosts-fr',
        id: '10345',
        title: 'The Duchess Who Sees Ghosts [FR]'
    },
    child: {
        id: '957430020',
        title: 'Épisode 1'
    },
    entry: {
        index: 0,
        size: 529_830,
        type: 'image/jpeg'
    }
}).AssertWebsite();

// CASE : German manga
new TestFixture({
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/de/book/the-duchess-who-sees-ghosts-de',
        id: '20345',
        title: 'The Duchess Who Sees Ghosts [DE]'
    },
    child: {
        id: '232906583',
        title: 'Kapitel 1'
    },
    entry: {
        index: 0,
        size: 523_689,
        type: 'image/jpeg'
    }
}).AssertWebsite();