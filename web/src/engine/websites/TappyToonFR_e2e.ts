import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tappytoon-fr',
        title: 'TappyToon (FR)'
    },
    container: {
        url: 'https://www.tappytoon.com/fr/book/the-duchess-who-sees-ghosts-fr',
        id: '10345',
        title: 'The Duchess Who Sees Ghosts'
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

new TestFixture(config).AssertWebsite();