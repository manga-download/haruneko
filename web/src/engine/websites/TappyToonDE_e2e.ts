import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'tappytoon-de',
        title: 'TappyToon (DE)'
    },
    container: {
        url: 'https://www.tappytoon.com/de/book/the-duchess-who-sees-ghosts-de',
        id: '20345',
        title: 'The Duchess Who Sees Ghosts'
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

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());