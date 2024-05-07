import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'niceoppai',
        title: 'NiceOppai'
    },
    container: {
        url: 'https://www.niceoppai.net/A-Golden-Palace-in-the-Last-Days/',
        id: '/A-Golden-Palace-in-the-Last-Days/',
        title: 'A Golden Palace in the Last Days'
    },
    child: {
        id: '/A-Golden-Palace-in-the-Last-Days/86/',
        title: '86 - 86'
    },
    entry: {
        index: 1,
        size: 207_885,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());