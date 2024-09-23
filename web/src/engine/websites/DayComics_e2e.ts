import { describe } from 'vitest';
import { TestFixture } from '../../../test/WebsitesFixture';

const config = {
    plugin: {
        id: 'daycomics',
        title: 'DayComics'
    },
    container: {
        url: 'https://daycomics.com/content/102562',
        id: '102562',
        title: 'Draco Run'
    },
    child: {
        id: '/content/102562/134459',
        title: 'Episode 1'
    },
    entry: {
        index: 0,
        size: 162_394,
        type: 'image/webp'
    }
};

const fixture = new TestFixture(config);
describe(fixture.Name, async () => (await fixture.Connect()).AssertWebsite());