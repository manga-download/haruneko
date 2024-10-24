import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
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
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());