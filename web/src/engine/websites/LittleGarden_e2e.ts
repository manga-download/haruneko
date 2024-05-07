import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'littlegarden',
        title: 'Little Garden'
    },
    container: {
        url: 'https://littlexgarden.com/tokyo-revengers',
        id: '/tokyo-revengers',
        title: 'Tokyo Revengers'
    },
    child: {
        id: JSON.stringify( { id: 3255, number: 5}),
        title: '5'
    },
    entry: {
        index: 0,
        size: 3_369_042,
        type: 'image/jpeg'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());