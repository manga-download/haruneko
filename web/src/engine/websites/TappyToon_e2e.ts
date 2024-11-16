import { TestFixture } from '../../../test/WebsitesFixture';

const configEN = {
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/en/book/the-duchess-who-sees-ghosts',
        id: JSON.stringify({ id: '345', language: 'en' }),
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
};

new TestFixture(configEN).AssertWebsite();

const configFR = {
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/fr/book/the-duchess-who-sees-ghosts-fr',
        id: JSON.stringify({ id: '10345', language: 'fr' }),
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
};

new TestFixture(configFR).AssertWebsite();

const configDE = {
    plugin: {
        id: 'tappytoon',
        title: 'TappyToon'
    },
    container: {
        url: 'https://www.tappytoon.com/de/book/the-duchess-who-sees-ghosts-de',
        id: JSON.stringify({ id: '20345', language: 'de' }),
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
};

new TestFixture(configDE).AssertWebsite();